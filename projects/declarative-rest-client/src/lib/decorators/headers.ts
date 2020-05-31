import { RestClient } from '../rest-client';

/**
 * Set custom headers for a REST method
 * @param httpHeaders - custom headers in a key-value pair
 */
export function headers(httpHeaders: { [header: string]: string | string[]; }) {
  return (target: RestClient, propertyKey: string, descriptor: any) => {
    descriptor.headers = httpHeaders;
    return descriptor;
  };
}
