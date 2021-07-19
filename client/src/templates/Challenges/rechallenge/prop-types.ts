import { File } from '../../../redux/prop-types';

export interface RequiredItem {
  link?: string;
  src?: string;
}

export enum Catch {
  HTML = '\n<!--fcc-->\n',
  JS = '\n;/*fcc*/\n',
  CSS = '\n/*fcc*/\n'
}

export interface ConcatHtmlProps {
  files?: File[];
  required: RequiredItem[];
  template?: string;
}
