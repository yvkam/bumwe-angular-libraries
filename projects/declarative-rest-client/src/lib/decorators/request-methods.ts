import {methodBuilder} from '../builders/request-builder';
import {RestClient} from '../rest-client';

export enum RequestMethod {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DECONSTE = 'deconste',
  PATCH = 'patch',
  HEAD = 'head',
  OPTIONS = 'options',
  JSONP = 'jsonp'
}

/**
 * get method
 * @param () => url - resource url of the method
 */
export const get: (url: string) => (target: RestClient, propertyKey: string, descriptor: any) => any =
  methodBuilder(RequestMethod.GET);

/**
 * post method
 * @param () => url - resource url of the method
 */
export const post: (url: string) => (target: RestClient, propertyKey: string, descriptor: any) => any =
  methodBuilder(RequestMethod.POST);

/**
 * put method
 * @param () => url - resource url of the method
 */
export const put: (url: string) => (target: RestClient, propertyKey: string, descriptor: any) => any =
  methodBuilder(RequestMethod.PUT);

/**
 * patch method
 * @param () => url - resource url of the method
 */
export const patch: (url: string) => (target: RestClient, propertyKey: string, descriptor: any) => any =
  methodBuilder(RequestMethod.PATCH);

/**
 * deconste method
 * @param () => url - resource url of the method
 */
export const deconste: (url: string) => (target: RestClient, propertyKey: string, descriptor: any) => any =
  methodBuilder(RequestMethod.DECONSTE);

/**
 * head method
 * @param () => url - resource url of the method
 */
export const head: (url: string) => (target: RestClient, propertyKey: string, descriptor: any) => any =
  methodBuilder(RequestMethod.HEAD);

/**
 * options method
 * @param () => url - resource url of the method
 */
export const options: (url: string) => (target: RestClient, propertyKey: string, descriptor: any) => any =
  methodBuilder(RequestMethod.OPTIONS);

/**
 * jsonp method
 * @param () => url - resource url of the method
 */
export const jsonp: (url: string) => (target: RestClient, propertyKey: string, descriptor: any) => any =
  methodBuilder(RequestMethod.JSONP);

