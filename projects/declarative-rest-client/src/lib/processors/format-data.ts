import { FORMAT } from '../decorators/parameters';

export function formatData(value, format: string) {
  switch (format) {
    case FORMAT.SSV:
      return value.join(' ');
    case FORMAT.TSV:
      return value.join('\t');
    case FORMAT.PIPES:
      return value.join('|');
    case FORMAT.MULTI:
      return value;
    case FORMAT.CSV:
    default:
      return value.join(',');
  }
}
