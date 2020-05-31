import { RestClient } from '../rest-client';

/**
 * Defines a custom mapper function
 * @param mapper function to map
 */
export function map<T, R>(mapper: (resp: T) => R) {
  return ( arget: RestClient, propertyKey: string, descriptor) => {
    if (!descriptor.mappers) {
      descriptor.mappers = [];
    }
    descriptor.mappers.push(mapper);
    return descriptor;
  };
}
