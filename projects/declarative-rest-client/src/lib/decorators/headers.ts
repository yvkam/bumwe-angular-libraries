import { RestClient } from '../rest-client';

/**
 * Set custom Headers for a REST method
 * @param httpHeaders - custom Headers in a key-value pair
 */
export function Headers(httpHeaders: { [header: string]: string | string[]; }) {
  return (target: RestClient, propertyKey: string, descriptor: any) => {
    descriptor.headers = httpHeaders;
    return descriptor;
  };
}
