import {inject, Injectable} from "@angular/core";
import {Observable, of} from "rxjs";
import {CalendarEventCreateRequest} from "../interfaces/requests/calendar-event-create.request";
import { HttpClient } from "@angular/common/http";
import {CalendarEvent} from "../interfaces/calendar-event";
import {CalendarEventInstancesContainer} from "../interfaces/calendar-event-instances-container";

@Injectable({
  providedIn: 'root'
})
export class CalendarEventService {

  private readonly baseUrl = 'api/calendar-events';

  private readonly _http = inject(HttpClient);

  createEvent(request: CalendarEventCreateRequest): Observable<Boolean> {
    console.log('request',request)
    //return of(true);
    return this._http.post<Boolean>(`${this.baseUrl}`, request);
  }

  getEvents(id: number): Observable<CalendarEvent[]> {
    return this._http.get<CalendarEvent[]>(`${this.baseUrl}/${id}`);
  }

  getCalendarEventInstances(eventId: number): Observable<CalendarEventInstancesContainer> {
    return this._http.get<CalendarEventInstancesContainer>(`${this.baseUrl}/generate-event-instances/${eventId}`);
  }

  getInstancesForEvents(from: Date): Observable<CalendarEventInstancesContainer[]> {
    return this._http.get<CalendarEventInstancesContainer[]>(`${this.baseUrl}/generate-instances-for-events?from=${from.toISOString()}`);
  }

}
