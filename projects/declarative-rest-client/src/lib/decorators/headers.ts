import { AbstractRestClient } from '../abstract-rest-client';

/**
 * Set custom Headers for a REST method
 * @param httpHeaders - custom Headers in a key-value pair
 */
export function Headers(httpHeaders: { [header: string]: string | string[]; }) {
  return (target: AbstractRestClient, propertyKey: string, descriptor) => {
    descriptor.headers = httpHeaders;
    return descriptor;
  };
}
