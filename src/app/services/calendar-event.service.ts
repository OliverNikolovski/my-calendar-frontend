import {inject, Injectable} from "@angular/core";
import {Observable, of} from "rxjs";
import {CalendarEventCreateRequest} from "../interfaces/requests/calendar-event-create.request";
import {HttpClient, HttpParams} from "@angular/common/http";
import {CalendarEvent} from "../interfaces/calendar-event";
import {CalendarEventInstancesContainer} from "../interfaces/calendar-event-instances-container";
import {CalendarEventInstanceInfo} from "../interfaces/calendar-event-instance-info";
import {DeletionType} from "../configs/deletion-type.enum";

@Injectable({
  providedIn: 'root'
})
export class CalendarEventService {

  readonly #baseUrl = 'api/calendar-events';

  readonly #http = inject(HttpClient);

  createEvent(request: CalendarEventCreateRequest): Observable<Boolean> {
    return this.#http.post<Boolean>(`${this.#baseUrl}`, request);
  }

  getEvents(id: number): Observable<CalendarEvent[]> {
    return this.#http.get<CalendarEvent[]>(`${this.#baseUrl}/${id}`);
  }

  getCalendarEventInstances(eventId: number): Observable<CalendarEventInstancesContainer> {
    return this.#http.get<CalendarEventInstancesContainer>(`${this.#baseUrl}/generate-event-instances/${eventId}`);
  }

  getInstancesForEvents(from: Date): Observable<CalendarEventInstancesContainer> {
    return this.#http.get<CalendarEventInstancesContainer>(`${this.#baseUrl}/generate-instances-for-events?from=${from.toISOString()}`);
  }

  deleteEvent(eventId: number, fromDate: Date, deletionType: DeletionType): Observable<void> {
    const params = new HttpParams({
      fromObject: {
        fromDate: fromDate.toISOString(),
        deletionType: deletionType
      }
    });
    return this.#http.delete<void>(`${this.#baseUrl}/${eventId}`, { params });
  }

}
