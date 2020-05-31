import { RestClient } from '../rest-client';
import { Observable } from 'rxjs';

/**
 * Called just before emitting the request, used to add functions to the observable
 * @param emitter function to add functions to the observable
 */
export function onEmit<T>(emitter: (resp: Observable<T>) => Observable<T>) {
  return ( target: RestClient, propertyKey: string, descriptor: any) => {
    if ( !descriptor.emitters ) {
      descriptor.emitters = [];
    }
    descriptor.emitters.push(emitter);
    return descriptor;
  };
}
