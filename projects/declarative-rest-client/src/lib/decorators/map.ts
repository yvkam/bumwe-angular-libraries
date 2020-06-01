import { RestClient } from '../rest-client';

/**
 * Defines a custom mapper function
 * @param mapper function to Map
 */
export function Map<R>(mapper: (responseBody: any) => R) {
  return ( arget: RestClient, propertyKey: string, descriptor) => {
    descriptor.mapper = mapper;
    return descriptor;
  };
}
