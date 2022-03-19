import { AbstractRestClient } from '../abstract-rest-client';

/**
 * Defines a custom timeout function.
 * @param  value - The timeout duration in milliseconds.
 */
export function timeout(value: number) {
  return (target: AbstractRestClient, propertyKey: string, descriptor: any) => {
    descriptor.timeout = timeout;
    return descriptor;
  };
}
