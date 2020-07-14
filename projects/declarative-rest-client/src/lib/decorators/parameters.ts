import {RestClient} from '../rest-client';

export const metadataKeySuffix = {
  variable: `_PathParam_parameters`,
  queryParam: `_QueryParam_parameters`,
  plainQuery: `_PlainQuery_parameters`,
  body: `_Body_parameters`,
  plainBody: `_PlainBody_parameters`,
  header: `_Header_parameters`,
};

/**
 * variable variable of a method's url, type: string
 * @param key - path key to bind value
 */
export const pathParam = paramBuilder(metadataKeySuffix.pathParam);

/**
 * QueryParam value of a method's url, type: string
 * @param  key - query key to bind value
 */
export const QueryParam = paramBuilder(metadataKeySuffix.queryParam);

/**
 * QueryParam value of a method's url,
 * type: key-value pair object or key-value pair string separated by '&'
 */
export const PlainQuery = paramBuilder(metadataKeySuffix.plainQuery)(metadataKeySuffix.plainQuery);

/**
 * Body of a REST method, type: key-value pair object
 * Only one Body per method!
 */
export const Body = paramBuilder(metadataKeySuffix.body)(metadataKeySuffix.body);

/**
 * Body of a REST method, type: key-value pair string separated by '&'
 * Only one Body per method!
 */
export const PlainBody = paramBuilder(metadataKeySuffix.plainBody)(metadataKeySuffix.plainBody);

/**
 * Custom Header of a REST method, type: string
 * @param key - Header key to bind value
 */
export const Header = paramBuilder(metadataKeySuffix.header);


/**
 * collection Formats
 */
export const FORMAT = {
  /**
   *  comma separated values foo,bar.
   */
  CSV: 'CSV',

  /**
   *  space separated values foo bar.
   */
  SSV: 'SSV',

  /**
   *  tab separated values foo\tbar.
   */
  TSV: 'TSV',

  /**
   *  pipe separated values foo|bar.
   */
  PIPES: 'PIPES',

  /**
   *  corresponds to multiple parameter instances instead of multiple values for a single instance foo=bar&foo=baz.
   *  This is valid only for parameters in "query" or "formData".
   */
  MULTI: 'MULTI',
};

function validateFormat(format: string): string {
  if (!format) {
    return undefined;
  }

  if (!FORMAT[format]) {
    throw new Error('Unknown Collection FORMAT: \'' + format + '\'');
  }

  return format;
}

export function paramBuilder(paramName: string) {
  return (name?: string, args?: { value?: any, format?: string }) => {
    return (target: RestClient, propertyKey: string | symbol, index: number) => {
      const value = args ? args.value : undefined;
      const format = args ? validateFormat(args.format) : undefined;
      const metadataKey = `${propertyKey as string}${paramName}`;
      const metadata = { key: name, value, index, format};
      target[metadataKey] = (target[metadataKey] || []) as Array<any>;
      target[metadataKey].push(metadata);
    };
  };
}

export interface ParameterMetadata {
  key: string;
  value: string;
  index: string;
  format: string;
}
