import { RestClient } from '../rest-client';

/**
 * Defines a custom mapper function
 * @param mapper function to Map
 */
export function Map<R>(mapper: (resp: any) => R) {
  return ( arget: RestClient, propertyKey: string, descriptor) => {
    if (!descriptor.mappers) {
      descriptor.mappers = [];
    }
    descriptor.mappers.push(mapper);
    return descriptor;
  };
}
