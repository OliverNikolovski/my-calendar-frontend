import {inject, Injectable} from "@angular/core";
import {Observable, of} from "rxjs";
import {CalendarEventCreateRequest} from "../interfaces/requests/calendar-event-create.request";
import {HttpClient, HttpParams} from "@angular/common/http";
import {CalendarEvent} from "../interfaces/calendar-event";
import {CalendarEventInstancesContainer} from "../interfaces/calendar-event-instances-container";
import {CalendarEventInstanceInfo} from "../interfaces/calendar-event-instance-info";
import {ActionType} from "../configs/deletion-type.enum";
import {CalendarEventUpdateRequest} from "../interfaces/requests/calendar-event-update.request";

@Injectable({
  providedIn: 'root'
})
export class CalendarEventService {

  readonly #baseUrl = 'api/calendar-events';

  readonly #http = inject(HttpClient);

  createEvent(request: CalendarEventCreateRequest): Observable<number> {
    return this.#http.post<number>(`${this.#baseUrl}`, request);
  }

  getInstancesForEvents(from: Date): Observable<CalendarEventInstancesContainer> {
    return this.#http.get<CalendarEventInstancesContainer>(`${this.#baseUrl}/generate-instances-for-events?from=${from.toISOString()}`);
  }

  getEventInstances(eventId: number): Observable<CalendarEventInstancesContainer> {
    return this.#http.get<CalendarEventInstancesContainer>(`${this.#baseUrl}/generate-instances-for-event-id?eventId=${eventId}`);
  }

  deleteEvent(eventId: number, fromDate: Date, deletionType: ActionType, order: number): Observable<void> {
    const params = new HttpParams({
      fromObject: {
        fromDate: fromDate.toISOString(),
        deletionType,
        order
      }
    });
    return this.#http.delete<void>(`${this.#baseUrl}/${eventId}`, { params });
  }

  updateEvent(updateRequest: CalendarEventUpdateRequest): Observable<void> {
    return this.#http.patch<void>(`${this.#baseUrl}`, updateRequest);
  }

}
