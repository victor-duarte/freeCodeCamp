import { File } from '../../../redux/prop-types';

interface RechallengeFileType extends File {
  importedFiles: string[];
}

export interface RequiredItem {
  link?: string;
  src?: string;
}

interface ConcatHtmlProps {
  files?: RechallengeFileType[];
  required: RequiredItem[];
  template?: string;
}

export declare function concatHtml(props: ConcatHtmlProps): string;
