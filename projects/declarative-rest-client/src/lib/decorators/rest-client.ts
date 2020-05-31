/**
 * Configure the REST restClient
 * @param args restClient arguments
 */
export function restClient(args: { serviceId?: string, baseUrl?: string, headers?: any, withCredentials?: any } ) {
  return ( Target ) => {
    if ( args.serviceId ) {
      Target.prototype.getServiceId = () => {
        return args.serviceId;
      };
    }
    if ( args.baseUrl ) {
      Target.prototype.getBaseUrl = () => {
        return args.baseUrl;
      };
    }
    if ( args.headers ) {
      Target.prototype.getDefaultHeaders = () => args.headers;
    }
    if ( args.withCredentials ) {
      Target.prototype.isWithCredentials = () => args.withCredentials;
    }
    return Target;
  };
}
