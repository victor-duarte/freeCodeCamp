import {
  cond,
  flow,
  identity,
  matchesProperty,
  partial,
  stubTrue,
  template as _template
} from 'lodash-es';

import {
  compileHeadTail,
  setExt,
  transformContents
} from '../../../../../utils/polyvinyl';

const htmlCatch = '\n<!--fcc-->\n';
const jsCatch = '\n;/*fcc*/\n';
const cssCatch = '\n/*fcc*/\n';

const wrapInScript = partial(
  transformContents,
  content => `${htmlCatch}<script>${content}${jsCatch}</script>`
);

const wrapInStyle = partial(
  transformContents,
  content => `${htmlCatch}<style>${content}${cssCatch}</style>`
);

const setExtToHTML = partial(setExt, 'html');
const padContentWithJsCatch = partial(compileHeadTail, jsCatch);
const padContentWithCssCatch = partial(compileHeadTail, cssCatch);

export const jsToHtml = cond([
  [
    matchesProperty('ext', 'js'),
    flow(padContentWithJsCatch, wrapInScript, setExtToHTML)
  ],
  [stubTrue, identity]
]);

export const cssToHtml = cond([
  [
    matchesProperty('ext', 'css'),
    flow(padContentWithCssCatch, wrapInStyle, setExtToHTML)
  ],
  [stubTrue, identity]
]);

/**
 * Interpolates the given input source in a generic `<body>` template.
 * @params {Object} obj.source Generated source (markup)
 * @return {string} The interpolated `<body>` string
 */
export function getDefaultTemplate({ source }) {
  return `
  <body id='display-body'style='margin:8px;'>
    <!-- fcc-start-source -->
      ${source}
    <!-- fcc-end-source -->
  </body>`;
}

/**
 * Filters the `Files` which first element in the `history` property is the
 * string `index.html` and returns the File if only one is filtered.
 * @params {array} files array of items of type required item.
 * @returns {object} Re-challenge file type or undefined.
 */
export function getInitialHtmlFile(files) {
  const filtered = files.filter(file => wasHtmlFile(file));

  if (filtered.length > 1) {
    throw new Error('Too many html blocks in the challenge seed');
  }

  return filtered[0];
}

/**
 * Evaluates if the first element in the `history` property is the string.
 * `index.html`.
 * @params {Object} file re-challenge file type.
 * @returns {boolean} Boolean.
 */
function wasHtmlFile(file) {
  return file.history[0] === 'index.html';
}

/**
 * Generates the `<link>s` and `<script>s` strings.
 * @params {array} required array of items of type required item.
 * @return {string} Styles and scripts block as string.
 */
function getHeadContent(required) {
  return required
    .map(({ link, src }) => {
      if (link && src) {
        throw new Error(`
A required file can not have both a src and a link: src = ${src}, link = ${link}
`);
      }

      if (src) {
        return `<script src='${src}' type='text/javascript'></script>`;
      }

      if (link) {
        return `<link href='${link}' rel='stylesheet' />`;
      }

      return '';
    })
    .reduce((head, element) => head.concat(element));
}

/**
 * Reduces the files content into a single source if criteria are met.
 * @params {array} files Array of re-challenge file type[].
 * @params {Object} [indexHtml] indexHtml re-challenge file type.
 * @returns {string} String of generated source (markup).
 */
function getFilesSource(files, indexHtml) {
  return files.reduce((source, file) => {
    if (!indexHtml) return source.concat(file.contents, htmlCatch);

    if (
      indexHtml.importedFiles.includes(file.history[0]) ||
      wasHtmlFile(file)
    ) {
      return source.concat(file.contents, htmlCatch);
    }

    return source;
  }, '');
}

export function concatHtml({ required = [], template, files = [] } = {}) {
  const createBody = template ? _template(template) : getDefaultTemplate();
  const head = getHeadContent(required);
  const indexHtml = getInitialHtmlFile(files);
  const source = getFilesSource(files, indexHtml);

  return `<head>${head}</head>${createBody({ source })}`;
}
