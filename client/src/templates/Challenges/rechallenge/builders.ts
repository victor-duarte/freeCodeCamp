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

import {
  getDefaultTemplate,
  getHeadString,
  getInitialHtmlFile,
  getSource
} from './utils';

import { Catch, ConcatHtmlProps } from './prop-types';

const wrapInScript = partial(
  transformContents,
  (content: string): string =>
    `${Catch.HTML}<script>${content}${Catch.JS}</script>`
);

const wrapInStyle = partial(
  transformContents,
  (content: string): string =>
    `${Catch.HTML}<style>${content}${Catch.CSS}</style>`
);

const setExtToHTML = partial(setExt, 'html');
const padContentWithJsCatch = partial(compileHeadTail, Catch.JS);
const padContentWithCssCatch = partial(compileHeadTail, Catch.CSS);

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

export function concatHtml({
  files = [],
  required = [],
  template
}: ConcatHtmlProps): string {
  const createBody = template ? _template(template) : getDefaultTemplate;
  const head = getHeadString(required);
  const indexHtml = getInitialHtmlFile(files);
  const source = getSource(files, indexHtml);

  return `<head>${head}</head>${createBody({ source })}`;
}
