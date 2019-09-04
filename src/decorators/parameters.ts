import { RestClient } from '../rest-client';

/**
 * collection Formats
 */
export const Format = {
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

export function paramBuilder( paramName: string ) {
  return function ( name: string, options?: { value?: any, format?: string } ) {
    return function ( target: RestClient, propertyKey: string | symbol, parameterIndex: number ) {
      let format;
      let value;
      if ( options instanceof Object ) {
        if ( options.value ) {
          value = options.value;
        }
        if ( options.format ) {
          if ( Format[ options.format ] ) {
            format = options.format;
          } else {
            throw new Error( 'Unknown Collection Format: \'' + options.format + '\'' );
          }
        }
      }
      if ( typeof options === 'string' ) {
        value = options;
      }
      var metadataKey   = `${<string>propertyKey}_${paramName}_parameters`;
      var paramObj: any = {
        key: name,
        parameterIndex: parameterIndex,
        value: value,
        format: format
      };
      if ( Array.isArray( target[ metadataKey ] ) ) {
        target[ metadataKey ].push( paramObj );
      } else {
        target[ metadataKey ] = [ paramObj ];
      }
    };
  };
}

/**
 * Path variable of a method's url, type: string
 * @param {string} key - path key to bind value
 */
export const Path = paramBuilder( 'Path' );

/**
 * Query value of a method's url, type: string
 * @param {string} key - query key to bind value
 */
export const Query = paramBuilder( 'Query' );

/**
 * Query value of a method's url, type: key-value pair object
 */
export const PlainQuery = paramBuilder( 'PlainQuery' )( 'PlainQuery' );

/**
 * Body of a REST method, type: key-value pair object
 * Only one body per method!
 */
export const Body = paramBuilder( 'Body' )( 'Body' );

/**
 * Body of a REST method, type: key-value pair string separated by '&'
 * Only one body per method!
 */
export const PlainBody = paramBuilder( 'PlainBody' )( 'PlainBody' );

/**
 * Custom header of a REST method, type: string
 * @param {string} key - header key to bind value
 */
export const Header = paramBuilder( 'Header' );
