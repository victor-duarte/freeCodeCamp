import { Catch, RechallengeFileType, RequiredItem } from './prop-types';

interface Body {
  source: string;
}

/**
 * Interpolates the given input source in a generic `<body>` template.
 * @return {string} The interpolated `<body>` string
 */
export function getDefaultTemplate({ source }: Body): string {
  if (!source) {
    return `
  <body id="display-body" style="margin: 8px;">
    <!-- fcc-start-source -->
    <!-- fcc-end-source -->
  </body>`;
  }

  return `
  <body id="display-body" style="margin: 8px;">
    <!-- fcc-start-source -->
      ${source}
    <!-- fcc-end-source -->
  </body>`;
}

export const ERROR_HTML_FILTER = 'Too many html blocks in the challenge seed';

/**
 * Filters the `Files` which first element in the `history` property is the
 * string `index.html` and returns the File if only one is filtered.
 * @returns {object} File
 */
export function getInitialHtmlFile(
  files: RechallengeFileType[]
): RechallengeFileType | undefined {
  const filtered = files.filter(file => wasHtmlFile(file));

  if (filtered.length > 1) {
    throw new Error(ERROR_HTML_FILTER);
  }

  return filtered[0];
}

/**
 * Evaluates if the first element in the `history` property is the string
 * `index.html`.
 * @returns {boolean} Boolean
 */
function wasHtmlFile(file: RechallengeFileType): boolean {
  return file.history[0] === 'index.html';
}

export const ERROR_NO_ITEMS = 'Require does not contain any elements';

/**
 * Reduces the `required` items into a string of `<link>s` and `<script>s`
 * @return {string} Styles and scripts block as string
 */
export function getHeadString(required: RequiredItem[]): string {
  if (required.length === 0) {
    throw new Error(ERROR_NO_ITEMS);
  }

  return required
    .map(({ link, src }: RequiredItem): string => {
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
    .reduce((head, element) => head.concat(element), '');
}

/**
 * Reduces the files content into a single source if criteria are met
 * @returns {string} string of generated source
 */
export function getSource(
  files: RechallengeFileType[],
  indexHtml?: RechallengeFileType | undefined
): string {
  return files.reduce((source: string, file: RechallengeFileType): string => {
    if (!indexHtml) return source.concat(file.contents, Catch.HTML);

    if (
      (indexHtml.importedFiles &&
        indexHtml.importedFiles.includes(file.history[0])) ||
      wasHtmlFile(file)
    ) {
      return source.concat(file.contents, Catch.HTML);
    }

    return source;
  }, '');
}
