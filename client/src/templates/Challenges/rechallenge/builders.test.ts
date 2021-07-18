import { concatHtml } from './builders';
import {
  ConcatHtmlProps,
  RechallengeFileType,
  RequiredItem
} from './prop-types';

describe('concatHtml action', () => {
  const required: RequiredItem[] = [
    {
      link: 'https://cdn.../normalize.min.css'
    }
  ];

  const files: RechallengeFileType[] = [
    {
      contents: '<h1>Hello World!</h1>',
      editableContents: '',
      editableRegionBoundaries: [],
      ext: 'html',
      head: '',
      history: ['index.html'],
      id: '',
      importedFiles: [],
      key: 'indexhtml',
      name: '',
      path: '',
      seed: '',
      tail: ''
    }
  ];

  it('should render base template without a source', () => {
    const input: ConcatHtmlProps = { required };

    const expected = `<head><link href='https://cdn.../normalize.min.css' rel='stylesheet' /></head>
  <body id="display-body" style="margin: 8px;">
    <!-- fcc-start-source -->
    <!-- fcc-end-source -->
  </body>`;

    expect(concatHtml(input)).toEqual(expected);
  });

  it('should render base template with source', () => {
    const input: ConcatHtmlProps = {
      files,
      required
    };

    const expected = `<head><link href='https://cdn.../normalize.min.css' rel='stylesheet' /></head>
  <body id="display-body" style="margin: 8px;">
    <!-- fcc-start-source -->
      <h1>Hello World!</h1>
<!--fcc-->

    <!-- fcc-end-source -->
  </body>`;

    expect(concatHtml(input)).toEqual(expected);
  });

  it('should render custom template', () => {
    const input: ConcatHtmlProps = {
      files,
      required,
      template: '<body><%= source %><p>Welcome!</p></body>'
    };

    const expected = `<head><link href='https://cdn.../normalize.min.css' rel='stylesheet' /></head><body><h1>Hello World!</h1>
<!--fcc-->
<p>Welcome!</p></body>`;

    expect(concatHtml(input)).toEqual(expected);
  });
});
