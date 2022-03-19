import { ParameterMetadata } from '../decorators/parameters';
import { HttpHeaders } from '@angular/common/http';
import { formatData } from './format-data';

export function buildHeaders(
  classLevelHeaders,
  methodLevelHeaders,
  headerMetadata: ParameterMetadata[],
  options?: any
): HttpHeaders {
  let headers = new HttpHeaders(classLevelHeaders);

  // set method specific Headers
  for (const key in methodLevelHeaders) {
    if (methodLevelHeaders.hasOwnProperty(key)) {
      if (headers.has(key)) {
        headers = headers.append(key, methodLevelHeaders[key] + '');
      } else {
        headers = headers.set(key, methodLevelHeaders[key] + '');
      }
    }
  }

  // set Options Headers
  if (options) {
    if (options.consumes && options.consumes.length > 0) {
      headers = headers.set('accept', options.consumes.join(',') + '');
    }

    if (options.produces && options.produces.length > 0) {
      headers = headers.set('content-type', options.produces.join(',') + '');
    }

    if (options.requestAuthHeaders && options.requestAuthHeaders.length > 0) {
      options.requestAuthHeaders
        .map((t) => [t, sessionStorage.getItem(t)])
        .filter(([k, v]) => !!v)
        .forEach(([k, v]) => (headers = headers.set(k, v + '')));
    }
  }

  // set parameter specific Headers
  if (headerMetadata) {
    for (const k in headerMetadata) {
      if (headerMetadata.hasOwnProperty(k)) {
        let value: any = headerMetadata[k].value;
        if (Array.isArray(value)) {
          value = formatData(value, headerMetadata[k].format);
        }
        value = Array.isArray(value) ? value : [value];
        value.forEach(
          (v) => (headers = headers.append(headerMetadata[k].key, v + ''))
        );
      }
    }
  }

  return headers;
}
