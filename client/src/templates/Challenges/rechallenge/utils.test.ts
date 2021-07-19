import { File } from '../../../redux/prop-types';
import { RequiredItem } from './prop-types';

import {
  ERROR_HTML_FILTER,
  ERROR_NO_ITEMS,
  getDefaultTemplate,
  getHeadString,
  getInitialHtmlFile,
  getSource
} from './utils';

describe('getDefaultTemplate helper', () => {
  it('should interpolate the given input in a `<body>` string', () => {
    const input = '<h1>freeCodeCamp</h1>';
    const output = `
  <body id="display-body" style="margin: 8px;">
    <!-- fcc-start-source -->
      ${input}
    <!-- fcc-end-source -->
  </body>`;

    expect(getDefaultTemplate({ source: input })).toEqual(output);
  });
});

describe('getInitialHtmlFile helper', () => {
  it('should return the index.html file from an array', () => {
    const files: File[] = [
      {
        contents: 'the index html',
        editableContents: '',
        editableRegionBoundaries: [],
        ext: 'html',
        head: '',
        history: ['index.html'],
        id: '',
        key: 'indexhtml',
        name: 'index',
        path: 'index.html',
        seed: '<h1>Hello</h1>',
        seedEditableRegionBoundaries: [],
        tail: ''
      },
      {
        contents: 'the style file',
        editableContents: '',
        editableRegionBoundaries: [],
        ext: 'html',
        head: '',
        history: ['index.css', 'index.html'],
        id: '',
        key: 'indexhtml',
        name: 'index',
        path: 'index.html',
        seed: '<h1>Hello</h1>',
        seedEditableRegionBoundaries: [],
        tail: ''
      }
    ];

    expect(getInitialHtmlFile(files)).toStrictEqual(files[0]);
  });

  it('should return undefined when the index.html file is missing', () => {
    const files: File[] = [
      {
        contents: 'the js file',
        editableContents: '',
        editableRegionBoundaries: [],
        ext: 'html',
        head: '',
        history: ['index.css', 'index.html'],
        id: '',
        key: 'indexhtml',
        name: 'index',
        path: 'index.html',
        seed: '<h1>Hello</h1>',
        seedEditableRegionBoundaries: [],
        tail: ''
      },
      {
        contents: 'the style file',
        editableContents: '',
        editableRegionBoundaries: [],
        ext: 'html',
        head: '',
        history: ['index.js', 'index.html'],
        id: '',
        key: 'indexhtml',
        name: 'index',
        path: 'index.html',
        seed: '<h1>Hello</h1>',
        seedEditableRegionBoundaries: [],
        tail: ''
      }
    ];

    expect(getInitialHtmlFile(files)).toBeUndefined();
  });

  it('should throw if there are two or more index.htmls', () => {
    const files: File[] = [
      {
        contents: 'the index html',
        editableContents: '',
        editableRegionBoundaries: [],
        ext: 'html',
        head: '',
        history: ['index.html'],
        id: '',
        key: 'indexhtml',
        name: 'index',
        path: 'index.html',
        seed: '<h1>Hello</h1>',
        seedEditableRegionBoundaries: [],
        tail: ''
      },
      {
        contents: 'index html two',
        editableContents: '',
        editableRegionBoundaries: [],
        ext: 'html',
        head: '',
        history: ['index.css', 'index.html'],
        id: '',
        key: 'indexhtml',
        name: 'index',
        path: 'index.html',
        seed: '<h1>Hello</h1>',
        seedEditableRegionBoundaries: [],
        tail: ''
      },
      {
        contents: 'index html three',
        editableContents: '',
        editableRegionBoundaries: [],
        ext: 'html',
        head: '',
        history: ['index.html'],
        id: '',
        key: 'indexhtml',
        name: 'index',
        path: 'index.html',
        seed: '<h1>Hello</h1>',
        seedEditableRegionBoundaries: [],
        tail: ''
      }
    ];

    expect(() => getInitialHtmlFile(files)).toThrowError(ERROR_HTML_FILTER);
  });
});

describe('getHeadString', () => {
  const linkPath = 'https://cdn.../normalize.min.css';
  const srcPath = '/js/...5f31bad1.js';

  it('should generate the script and link tags if provided', () => {
    const required: RequiredItem[] = [
      {
        link: linkPath
      },
      {
        src: srcPath
      }
    ];

    const output = `<link href='${linkPath}' rel='stylesheet' /><script src='${srcPath}' type='text/javascript'></script>`;
    expect(getHeadString(required)).toEqual(output);
  });

  it('should generate the script tag if provided', () => {
    const required = [
      {
        src: '/js/frame-runner.ef12602558a15f31bad1.js'
      }
    ];

    const output = `<script src='${required[0].src}' type='text/javascript'></script>`;

    expect(getHeadString(required)).toEqual(output);
  });

  it('should generate the link tag if provided', () => {
    const required = [
      {
        link: linkPath
      }
    ];

    const output = `<link href='${linkPath}' rel='stylesheet' />`;

    expect(getHeadString(required)).toEqual(output);
  });

  it('should generate multiple scripts and links tags if provided', () => {
    const required: RequiredItem[] = [
      {
        link: linkPath
      },
      {
        link: linkPath
      },
      {
        src: srcPath
      },
      {
        src: srcPath
      }
    ];

    const output = `<link href='${linkPath}' rel='stylesheet' /><link href='${linkPath}' rel='stylesheet' /><script src='${srcPath}' type='text/javascript'></script><script src='${srcPath}' type='text/javascript'></script>`;

    expect(getHeadString(required)).toEqual(output);
  });

  it('should generate empty string if no scripts nor links are provided', () => {
    const required = [{}];

    const output = '';

    expect(getHeadString(required)).toEqual(output);
  });

  it('should throw if no required items are provided', () => {
    expect(() => getHeadString([])).toThrowError(ERROR_NO_ITEMS);
  });

  it('should throw if a required item provides a link and src', () => {
    const required = [
      {
        link: linkPath,
        src: '/js/frame-runner.ef12602558a15f31bad1.js'
      }
    ];
    expect(() => getHeadString(required)).toThrow();
  });
});

describe('getSource', () => {
  it('should generate the source out of multiple files', () => {
    const files: File[] = [
      {
        contents: '<h1>Hello World</h1>',
        editableContents: '',
        editableRegionBoundaries: [],
        ext: 'html',
        head: '',
        history: ['index.html'],
        id: '',
        key: 'indexhtml',
        name: 'index',
        path: 'index.html',
        seed: '<h1>Hello</h1>',
        seedEditableRegionBoundaries: [],
        tail: ''
      },
      {
        contents: '<h2>CatPhotoApp</h2>',
        editableContents: '',
        editableRegionBoundaries: [],
        ext: 'html',
        head: '',
        history: ['index.html'],
        id: '',
        key: 'indexhtml',
        name: 'index',
        path: 'index.html',
        seed: '<h1>Hello</h1>',
        seedEditableRegionBoundaries: [],
        tail: ''
      }
    ];

    const output = `<h1>Hello World</h1>
<!--fcc-->
<h2>CatPhotoApp</h2>
<!--fcc-->
`;

    expect(getSource(files)).toEqual(output);
  });

  it('should generate the source from file(s) if first item in file history exists in `importedFiles` OR file was initially an html type file', () => {
    const files: File[] = [
      {
        contents: '<h1>Hello World</h1>',
        editableContents: '',
        editableRegionBoundaries: [],
        ext: 'html',
        head: '',
        history: ['index.html'],
        id: '',
        importedFiles: ['index.html'],
        key: 'indexhtml',
        name: 'index',
        path: 'index.html',
        seed: '<h1>Hello</h1>',
        seedEditableRegionBoundaries: [],
        tail: ''
      }
    ];

    const aFile: File = {
      contents: '<h2>CatPhotoApp</h2>',
      editableContents: '',
      editableRegionBoundaries: [],
      ext: 'html',
      head: '',
      history: ['index.html'],
      id: '',
      importedFiles: ['index.html', 'index.css'],
      key: 'indexhtml',
      name: 'index',
      path: 'index.html',
      seed: '<h1>Hello</h1>',
      seedEditableRegionBoundaries: [],
      tail: ''
    };

    const output = `<h1>Hello World</h1>
<!--fcc-->
`;

    expect(getSource(files, aFile)).toEqual(output);
  });

  it('should generate fallback empty string if indexHtml importFiles does not match history of `file` or `file` was not initially an html type file', () => {
    const files: File[] = [
      {
        contents: '<h1>Hello World</h1>',
        editableContents: '',
        editableRegionBoundaries: [],
        ext: 'html',
        head: '',
        history: ['index.css'],
        id: '',
        importedFiles: [],
        key: 'indexhtml',
        name: 'index',
        path: 'index.html',
        seed: '<h1>Hello</h1>',
        seedEditableRegionBoundaries: [],
        tail: ''
      }
    ];

    const aFile: File = {
      contents: '<h2>CatPhotoApp</h2>',
      editableContents: '',
      editableRegionBoundaries: [],
      ext: 'html',
      head: '',
      history: ['index.html'],
      id: '',
      importedFiles: ['index.html'],
      key: 'indexhtml',
      name: 'index',
      path: 'index.html',
      seed: '<h1>Hello</h1>',
      seedEditableRegionBoundaries: [],
      tail: ''
    };

    const output = '';

    expect(getSource(files, aFile)).toEqual(output);
  });
});
