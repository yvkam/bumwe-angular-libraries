import {methodBuilder} from '../builders/request-builder';
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
 * GET method
 * @param () => url - resource url of the method
 */
export const GET: (url: string) => (target: RestClient, propertyKey: string, descriptor: any) => any =
  methodBuilder(RequestMethod.GET);

/**
 * POST method
 * @param () => url - resource url of the method
 */
export const POST: (url: string) => (target: RestClient, propertyKey: string, descriptor: any) => any =
  methodBuilder(RequestMethod.POST);

/**
 * PUT method
 * @param () => url - resource url of the method
 */
export const PUT: (url: string) => (target: RestClient, propertyKey: string, descriptor: any) => any =
  methodBuilder(RequestMethod.PUT);

/**
 * PATCH method
 * @param () => url - resource url of the method
 */
export const PATCH: (url: string) => (target: RestClient, propertyKey: string, descriptor: any) => any =
  methodBuilder(RequestMethod.PATCH);

/**
 * DECONSTE method
 * @param () => url - resource url of the method
 */
export const DECONSTE: (url: string) => (target: RestClient, propertyKey: string, descriptor: any) => any =
  methodBuilder(RequestMethod.DECONSTE);

/**
 * HEAD method
 * @param () => url - resource url of the method
 */
export const HEAD: (url: string) => (target: RestClient, propertyKey: string, descriptor: any) => any =
  methodBuilder(RequestMethod.HEAD);

/**
 * OPTIONS method
 * @param () => url - resource url of the method
 */
export const OPTIONS: (url: string) => (target: RestClient, propertyKey: string, descriptor: any) => any =
  methodBuilder(RequestMethod.OPTIONS);

/**
 * JSONP method
 * @param () => url - resource url of the method
 */
export const JSONP: (url: string) => (target: RestClient, propertyKey: string, descriptor: any) => any =
  methodBuilder(RequestMethod.JSONP);

