import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { EventData } from '../../domain/constants/event.class';

@Injectable({
  providedIn: 'root',
})
export class EventBusService {
  private subject$ = new Subject<EventData>();

  emit(event: EventData) : void {
    this.subject$.next(event);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on(eventName: string, action: any): Subscription {
    return this.subject$.pipe(
      filter((e: EventData) => e.name === eventName),
      map((e: EventData) => e['value'])).subscribe(action);
  }
}