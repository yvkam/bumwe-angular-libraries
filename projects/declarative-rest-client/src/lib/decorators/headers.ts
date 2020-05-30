import { RestClient } from '../rest-client';

/**
 * Set custom headers for a REST method
 * @param headers - custom headers in a key-value pair
 */
export function Headers(headers: { [header: string]: string | string[]; }) {
  return (target: RestClient, propertyKey: string, descriptor: any) => {
    descriptor.headers = headers;
    return descriptor;
  };
}
