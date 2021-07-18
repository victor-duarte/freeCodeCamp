import { RechallengeFileType, RequiredItem } from './prop-types';

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

const baseFile: RechallengeFileType = {
  contents: '<h1>Hello World</h1>',
  editableContents: '',
  editableRegionBoundaries: [],
  ext: 'html',
  head: '',
  history: ['index.html'],
  id: '',
  importedFiles: [],
  key: 'indexhtml',
  name: 'index',
  path: 'index.html',
  seed: '<h1>Hello World</h1>',
  seedEditableRegionBoundaries: [],
  tail: ''
};

describe('getInitialHtmlFile helper', () => {
  it('should return a file which history starts with index.html', () => {
    const files: RechallengeFileType[] = [
      baseFile,
      {
        ...baseFile,
        contents: '<style>h1 { color: red; }</style>',
        ext: 'css',
        history: ['index.css', 'index.html'],
        key: 'indexcss',
        path: 'index.css',
        seed: '<style>h1 { color: red; }</style>'
      }
    ];

    expect(getInitialHtmlFile(files)).toStrictEqual(files[0]);
  });

  it('should return undefined if no files contained a history starting with index.html', () => {
    const files: RechallengeFileType[] = [
      {
        ...baseFile,
        contents: '<script>const x = "hello"</p>',
        ext: 'js',
        history: ['index.js', 'index.html'],
        key: 'indexjs',
        name: 'index',
        path: 'index.js',
        seed: '<script>const x = "hello"</p>'
      },
      {
        ...baseFile,
        history: ['index.css', 'index.html']
      }
    ];

    expect(getInitialHtmlFile(files)).toBeUndefined();
  });

  it('should throw if multiple files history starts with index.html', () => {
    const files: RechallengeFileType[] = [
      baseFile,
      {
        ...baseFile,
        contents: '<h1>Hello Universe</h1>',
        seed: '<h1>Hello Universe</h1>'
      },
      {
        ...baseFile,
        contents: '<h1>Hello Cosmos</h1>',
        seed: '<h1>Hello Cosmos</h1>'
      }
    ];

    expect(() => getInitialHtmlFile(files)).toThrowError(ERROR_HTML_FILTER);
  });
});

describe('getHeadString', () => {
  const linkPath = 'https://cdn.../normalize.min.css';
  const srcPath = '/js/...5f31bad1.js';

  const requiredItemLink: RequiredItem = {
    link: linkPath
  };

  const requiredItemSrc: RequiredItem = {
    src: srcPath
  };

  it('should generate the script and link tags if provided', () => {
    const required: RequiredItem[] = [requiredItemLink, requiredItemSrc];
    const output = `<link href='${linkPath}' rel='stylesheet' /><script src='${srcPath}' type='text/javascript'></script>`;

    expect(getHeadString(required)).toEqual(output);
  });

  it('should generate the script tag if provided', () => {
    const required: RequiredItem[] = [requiredItemSrc];
    const output = `<script src='${srcPath}' type='text/javascript'></script>`;

    expect(getHeadString(required)).toEqual(output);
  });

  it('should generate the link tag if provided', () => {
    const required: RequiredItem[] = [requiredItemLink];
    const output = `<link href='${linkPath}' rel='stylesheet' />`;

    expect(getHeadString(required)).toEqual(output);
  });

  it('should generate multiple scripts and links tags if provided', () => {
    const required: RequiredItem[] = [
      requiredItemLink,
      requiredItemLink,
      requiredItemSrc,
      requiredItemSrc
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

  it('should throw if a required item provides the link and src', () => {
    const required = [
      {
        ...requiredItemLink,
        ...requiredItemSrc
      }
    ];
    expect(() => getHeadString(required)).toThrow();
  });
});

describe('getSource', () => {
  it('should generate the source out of multiple files', () => {
    const files: RechallengeFileType[] = [
      baseFile,
      {
        ...baseFile,
        contents: '<h2>CatPhotoApp</h2>',
        seed: '<h2>CatPhotoApp</h2>'
      }
    ];

    const output = `<h1>Hello World</h1>
<!--fcc-->
<h2>CatPhotoApp</h2>
<!--fcc-->
`;

    expect(getSource(files)).toEqual(output);
  });

  it('should generate the source from file(s) if the first item in the `file` history exists in the `importedFiles` OR if `file` was initially an html type file', () => {
    const files: RechallengeFileType[] = [baseFile];

    const aFile: RechallengeFileType = {
      ...baseFile,
      contents: '<h2>CatPhotoApp</h2>',
      importedFiles: ['index.html', 'index.css'],
      seed: '<h1>CatPhotoApp</h1>'
    };

    const output = `<h1>Hello World</h1>
<!--fcc-->
`;

    expect(getSource(files, aFile)).toEqual(output);
  });

  it('should return an empty string if indexHtml importFiles does not match history of `file` or `file` was not initially an html type file', () => {
    const files: RechallengeFileType[] = [
      {
        ...baseFile,
        history: ['index.css', 'index.html'],
        seed: '<h1>Hello World</h1>',
        seedEditableRegionBoundaries: [],
        tail: ''
      }
    ];

    const aFile: RechallengeFileType = {
      ...baseFile,
      contents: '<h2>CatPhotoApp</h2>',
      importedFiles: ['index.html'],
      seed: '<h2>CatPhotoApp</h2>'
    };
    const output = '';

    expect(getSource(files, aFile)).toEqual(output);
  });
});
