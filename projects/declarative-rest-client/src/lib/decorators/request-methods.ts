import {requestMethodProcessor, RequestMethodArgs} from '../processors/request-method-processor';
import {RestClient} from '../rest-client';

export enum RequestMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  TRACE = 'TRACE',
  PATCH = 'PATCH',
  HEAD = 'HEAD',
  OPTIONS = 'OPTIONS'
}

/**
 * Get method
 * @param () => url - resource url of the method
 */
export const Request: (request: RequestMethodArgs, options?: RequestMethodOptions) =>
  (target: RestClient, propertyKey: string, descriptor: any) => any = requestMethodProcessor();

/**
 * Get method
 * @param () => url - resource url of the method
 */
export const Get: (path: string, options?: RequestMethodOptions) => (target: RestClient, propertyKey: string, descriptor: any) => any =
  requestMethodProcessor(RequestMethod.GET);

/**
 * Post method
 * @param () => url - resource url of the method
 */
export const Post: (path: string, options?: RequestMethodOptions) => (target: RestClient, propertyKey: string, descriptor: any) => any =
  requestMethodProcessor(RequestMethod.POST);

/**
 * Put method
 * @param () => url - resource url of the method
 */
export const Put: (path: string, options?: RequestMethodOptions) => (target: RestClient, propertyKey: string, descriptor: any) => any =
  requestMethodProcessor(RequestMethod.PUT);

/**
 * Patch method
 * @param () => url - resource url of the method
 */
export const Patch: (path: string, options?: RequestMethodOptions) => (target: RestClient, propertyKey: string, descriptor: any) => any =
  requestMethodProcessor(RequestMethod.PATCH);

/**
 * Trace method
 * @param () => url - resource url of the method
 */
export const Trace: (path: string, options?: RequestMethodOptions) => (target: RestClient, propertyKey: string, descriptor: any) => any =
  requestMethodProcessor(RequestMethod.TRACE);

/**
 * Head method
 * @param () => url - resource url of the method
 */
export const Head: (path: string, options?: RequestMethodOptions) => (target: RestClient, propertyKey: string, descriptor: any) => any =
  requestMethodProcessor(RequestMethod.HEAD);

/**
 * Options method
 * @param () => url - resource url of the method
 */
export const Options: (path: string, options?: RequestMethodOptions) => (target: RestClient, propertyKey: string, descriptor: any) => any =
  requestMethodProcessor(RequestMethod.OPTIONS);


export interface RequestMethodOptions {
  produces?: string[];
  consumes?: string[];
  timeout?: number;
  authenticationTokens?: string[];
  tokensToIntercept?: string[];
}
