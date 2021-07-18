import { File } from '../../../redux/prop-types';

export interface RechallengeFileType extends File {
  importedFiles: string[];
}

export interface RequiredItem {
  link?: string;
  src?: string;
}

export interface ConcatHtmlProps {
  files?: RechallengeFileType[];
  required: RequiredItem[];
  template?: string;
}

export enum Catch {
  HTML = '\n<!--fcc-->\n',
  JS = '\n;/*fcc*/\n',
  CSS = '\n/*fcc*/\n'
}
