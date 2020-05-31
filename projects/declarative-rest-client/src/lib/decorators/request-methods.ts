import {methodBuilder, RequestMethodArgs} from '../builders/request-builder';
import {RestClient} from '../rest-client';

export enum RequestMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DECONSTE = 'DECONSTE',
  PATCH = 'PATCH',
  HEAD = 'HEAD',
  OPTIONS = 'OPTIONS',
  JSONP = 'JSONP'
}

/**
 * get method
 * @param () => url - resource url of the method
 */
export const request: (request: RequestMethodArgs, options?: RequestMethodOptions) =>
  (target: RestClient, propertyKey: string, descriptor: any) => any = methodBuilder();

/**
 * get method
 * @param () => url - resource url of the method
 */
export const get: (path: string, options?: RequestMethodOptions) => (target: RestClient, propertyKey: string, descriptor: any) => any =
  methodBuilder(RequestMethod.GET);

/**
 * post method
 * @param () => url - resource url of the method
 */
export const post: (path: string, options?: RequestMethodOptions) => (target: RestClient, propertyKey: string, descriptor: any) => any =
  methodBuilder(RequestMethod.POST);

/**
 * put method
 * @param () => url - resource url of the method
 */
export const put: (path: string, options?: RequestMethodOptions) => (target: RestClient, propertyKey: string, descriptor: any) => any =
  methodBuilder(RequestMethod.PUT);

/**
 * patch method
 * @param () => url - resource url of the method
 */
export const patch: (path: string, options?: RequestMethodOptions) => (target: RestClient, propertyKey: string, descriptor: any) => any =
  methodBuilder(RequestMethod.PATCH);

/**
 * deconste method
 * @param () => url - resource url of the method
 */
export const deconste: (path: string, options?: RequestMethodOptions) => (target: RestClient, propertyKey: string, descriptor: any) => any =
  methodBuilder(RequestMethod.DECONSTE);

/**
 * head method
 * @param () => url - resource url of the method
 */
export const head: (path: string, options?: RequestMethodOptions) => (target: RestClient, propertyKey: string, descriptor: any) => any =
  methodBuilder(RequestMethod.HEAD);

/**
 * options method
 * @param () => url - resource url of the method
 */
export const options: (path: string, options?: RequestMethodOptions) => (target: RestClient, propertyKey: string, descriptor: any) => any =
  methodBuilder(RequestMethod.OPTIONS);

/**
 * jsonp method
 * @param () => url - resource url of the method
 */
export const jsonp: (path: string, options?: RequestMethodOptions) => (target: RestClient, propertyKey: string, descriptor: any) => any =
  methodBuilder(RequestMethod.JSONP);

export interface RequestMethodOptions {
  produces?: string[];
  consumes?: string[];
  timeout?: number;
  tokensToSend?: string[];
  tokensToIntercept?: string[];
}
