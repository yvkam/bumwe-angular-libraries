import { AbstractRestClient } from '../abstract-rest-client';

/**
 * Defines a custom mapper function
 * @param mapper function to Map
 */
export function Map<R>(mapper: (responseBody) => R) {
  return (target: AbstractRestClient, propertyKey: string, descriptor) => {
    descriptor.mapper = mapper;
    return descriptor;
  };
}
