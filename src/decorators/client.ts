/**
 * Configure the REST Client
 * @param {String} url - base URL
 * @param {String} serviceId - Service ID
 * @param {Object} headers - deafult headers in a key-value pair
 */
export function Client( args: { serviceId?: string, baseUrl?: string, headers?: any, withCredentials?: any } ) {
  return function <TFunction extends Function>( Target: TFunction ): TFunction {
    if ( args.serviceId ) {
      Target.prototype.getServiceId = function () {
        return args.serviceId;
      };
    }
    if ( args.baseUrl ) {
      Target.prototype.getBaseUrl = function () {
        return args.baseUrl;
      };
    }
    if ( args.headers ) {
      Target.prototype.getDefaultHeaders = function () {
        return args.headers;
      };
    }
    if ( args.withCredentials ) {
      Target.prototype.isWithCredentials = function () {
        return args.withCredentials;
      };
    }
    return Target;
  };
}
