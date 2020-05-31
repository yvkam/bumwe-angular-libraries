import { RestClient } from '../rest-client';

/**
 * Defines a custom mapper function
 * @param mapper function to map
 */
export function map(mapper: (resp: any ) => any ) {
  return ( target: RestClient, propertyKey: string, descriptor: any ) => {
    if ( !descriptor.mappers ) {
      descriptor.mappers = [];
    }
    descriptor.mappers.push( mapper );
    return descriptor;
  };
}
