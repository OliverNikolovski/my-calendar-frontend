import {inject, Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {CalendarEventCreateRequest} from "../interfaces/requests/calendar-event-create.request";
import {HttpClient, HttpParams} from "@angular/common/http";
import {CalendarEventInstancesContainer} from "../interfaces/calendar-event-instances-container";
import {ActionType} from "../configs/deletion-type.enum";
import {CalendarEventUpdateRequest} from "../interfaces/requests/calendar-event-update.request";
import {ShareEventSequenceRequest} from "../interfaces/requests/share-event-sequence.request";

@Injectable({
  providedIn: 'root'
})
export class CalendarEventService {

  readonly #baseUrl = 'api/calendar-events';

  readonly #http = inject(HttpClient);

  createEvent(request: CalendarEventCreateRequest): Observable<number> {
    return this.#http.post<number>(`${this.#baseUrl}`, request);
  }

  getCalendarEventInstancesForAuthenticatedUser(): Observable<CalendarEventInstancesContainer> {
    return this.#http.get<CalendarEventInstancesContainer>(`${this.#baseUrl}/generate-calendar-event-instances-for-authenticated-user`);
  }

  getCalendarEventInstancesForUser(userId: number): Observable<CalendarEventInstancesContainer> {;
    return this.#http.get<CalendarEventInstancesContainer>(`${this.#baseUrl}/generate-calendar-event-instances-for-user/${userId}`);
  }

  getInstancesForSequence(sequenceId: String): Observable<CalendarEventInstancesContainer> {
    return this.#http.get<CalendarEventInstancesContainer>(`${this.#baseUrl}/event-instances-for-sequence/${sequenceId}`);
  }

  getEventInstances(eventId: number): Observable<CalendarEventInstancesContainer> {
    return this.#http.get<CalendarEventInstancesContainer>(`${this.#baseUrl}/generate-instances-for-event-id?eventId=${eventId}`);
  }

  deleteEvent(eventId: number, fromDate: Date, deletionType: ActionType, order: number): Observable<void> {
    const params = new HttpParams({
      fromObject: {
        fromDate: fromDate.toISOString(),
        actionType: deletionType,
        order: order
      }
    });
    return this.#http.delete<void>(`${this.#baseUrl}/${eventId}`, { params });
  }

  updateEvent(updateRequest: CalendarEventUpdateRequest): Observable<void> {
    return this.#http.patch<void>(`${this.#baseUrl}`, updateRequest);
  }

  shareEventSequence(request: ShareEventSequenceRequest): Observable<void> {
    return this.#http.post<void>(`${this.#baseUrl}/share`, request);
  }

  downloadCalendar(): any {
    return this.#http.get(`${this.#baseUrl}/export`, { responseType: 'blob' });
  }

  updateEventSequenceVisibility(sequenceId: string, isPublic: boolean): Observable<void> {
    return this.#http.patch<void>(`${this.#baseUrl}/update-event-visibility`, {sequenceId, isPublic});
  }

  updateCalendarVisibility(isPublic: boolean): Observable<void> {
    return this.#http.patch<void>(`${this.#baseUrl}/update-calendar-visibility?isPublic=${isPublic}`, {});
  }

  addOrUpdateEmailNotificationForEvent(eventId: number, minutes: number): Observable<void> {
    return this.#http.patch<void>(`${this.#baseUrl}/add-or-update-email-notification-config?eventId=${eventId}&minutes=${minutes}`, {});
  }

  importCalendar(icsFile: File): Observable<string> {
    const formData = new FormData();
    formData.set('file', icsFile);
    return this.#http.post(`${this.#baseUrl}/import`, formData, {
      responseType: 'text'
    });
  }
}
