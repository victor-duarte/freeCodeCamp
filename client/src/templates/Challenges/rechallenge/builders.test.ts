import { concatHtml } from './builders';
import { ConcatHtmlProps, RequiredItem } from './prop-types';
import { File } from '../../../redux/prop-types';

describe('concatHtml action', () => {
  const required: RequiredItem[] = [
    {
      link: 'https://cdn.../normalize.min.css'
    }
  ];

  const files: File[] = [
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

  it('should render base template with required fields', () => {
    const input: ConcatHtmlProps = { required };

    const expected = `<head><link href='https://cdn.../normalize.min.css' rel='stylesheet' /></head>
  <body id="display-body" style="margin: 8px;">
    <!-- fcc-start-source -->
    <!-- fcc-end-source -->
  </body>`;

    expect(concatHtml(input)).toEqual(expected);
  });

  it('should render base template', () => {
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
