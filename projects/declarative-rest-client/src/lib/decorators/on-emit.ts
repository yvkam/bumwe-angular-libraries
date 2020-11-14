import { AbstractRestClient } from '../abstract-rest-client';
import { Observable } from 'rxjs';

/**
 * Called just before emitting the Request, used to add functions to the observable
 * @param emitter function to add functions to the observable
 */
export function OnEmit<T>(emitter: (resp: Observable<any>) => Observable<T>) {
  return (target: AbstractRestClient, propertyKey: string, descriptor: any) => {
    if ( !descriptor.emitters ) {
      descriptor.emitters = [];
    }
    descriptor.emitters.push(emitter);
    return descriptor;
  };
}
