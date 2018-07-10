import { methodBuilder } from '../builders/request-builder';
import { RestClient } from '../rest-client';

export enum RequestMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH",
  HEAD = "HEAD",
  OPTIONS = "OPTIONS",
  JSONP = "JSONP"
};

/**
 * Get method
 * @param {string} url - resource url of the method
 */
export var Get: ( url: string ) => ( target: RestClient, propertyKey: string, descriptor: any ) => any = methodBuilder( RequestMethod.GET );

/**
 * Post method
 * @param {string} url - resource url of the method
 */
export var Post: ( url: string ) => ( target: RestClient, propertyKey: string, descriptor: any ) => any = methodBuilder( RequestMethod.POST );

/**
 * Put method
 * @param {string} url - resource url of the method
 */
export var Put: ( url: string ) => ( target: RestClient, propertyKey: string, descriptor: any ) => any = methodBuilder( RequestMethod.PUT );

/**
 * Patch method
 * @param {string} url - resource url of the method
 */
export var Patch: ( url: string ) => ( target: RestClient, propertyKey: string, descriptor: any ) => any = methodBuilder( RequestMethod.PATCH );

/**
 * Delete method
 * @param {string} url - resource url of the method
 */
export var Delete: ( url: string ) => ( target: RestClient, propertyKey: string, descriptor: any ) => any = methodBuilder( RequestMethod.DELETE );

/**
 * Head method
 * @param {string} url - resource url of the method
 */
export var Head: ( url: string ) => ( target: RestClient, propertyKey: string, descriptor: any ) => any = methodBuilder( RequestMethod.HEAD );

/**
 * Options method
 * @param {string} url - resource url of the method
 */
export var Options: ( url: string ) => ( target: RestClient, propertyKey: string, descriptor: any ) => any = methodBuilder( RequestMethod.OPTIONS );

/**
 * JSONP method
 * @param {string} url - resource url of the method
 */
export var JsonP: ( url: string ) => ( target: RestClient, propertyKey: string, descriptor: any ) => any = methodBuilder( RequestMethod.JSONP );

