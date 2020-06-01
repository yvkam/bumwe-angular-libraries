import {ParameterMetadata} from '../decorators/parameters';

export function buildUrl(baseUrl: string, path: string, pathParamsMetadata: ParameterMetadata[]) {
  const urlTemplate = buildFullUrlTemplate(baseUrl, path);
  return replacePathParams(urlTemplate, pathParamsMetadata);
}

function buildFullUrlTemplate(baseUrl: string, path: string) {
  if (!baseUrl) {
    return path;
  }

  // Check double slash conflict during the join of the baseUrl and path
  // TODO: a more robust implementation
  if (baseUrl.indexOf('/') === baseUrl.length - 1 && path.indexOf('/') === 0) {
    return baseUrl.substring(0, 1) + path;
  }

  return baseUrl + path;
}
function replacePathParams(urlTemplate: string, metadata: ParameterMetadata[]): string {
  let url = urlTemplate;

  if (!metadata) {
    return url;
  }

  metadata.forEach(m => url = replacePathParam(url, m.key, m.value));
  return url;
}

function replacePathParam(url: string, key: string, value: string) {
  if (!value) {
    throw new Error('Missing path variable \'' + key + '\' in path ' + url);
  }
  return url.replace('{' + key + '}', value);
}
