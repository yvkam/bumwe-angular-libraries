/**
 * Set custom Headers for a Graphql method
 * @param httpHeaders - custom Headers in a key-value pair
 */
import {GraphqlClient} from '../graphql-client';

export function Headers(httpHeaders: { [header: string]: string | string[]; }) {
  return (target: GraphqlClient, propertyKey: string, descriptor: any) => {
    descriptor.headers = httpHeaders;
    return descriptor;
  };
}
