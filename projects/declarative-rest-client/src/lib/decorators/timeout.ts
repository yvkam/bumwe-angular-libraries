import { RestClient } from '../rest-client';

/**
 * Defines a custom timeout function.
 * @param  value - The timeout duration in milliseconds.
 */
export function timeout(value: number) {
  return ( target: RestClient, propertyKey: string, descriptor: any ) => {
    if ( !descriptor.timeout ) {
      descriptor.timeout = [];
    }
    descriptor.timeout.push(timeout);
    return descriptor;
  };
}
