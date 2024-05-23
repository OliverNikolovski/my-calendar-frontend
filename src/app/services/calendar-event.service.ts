import {inject, Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {CalendarEventCreateRequest} from "../interfaces/requests/calendar-event-create.request";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CalendarEventService {

  private readonly baseUrl = 'api/calendar-events';

  private readonly _http = inject(HttpClient);

  createEvent(request: CalendarEventCreateRequest): Observable<Boolean> {
    return this._http.post<Boolean>(`${this.baseUrl}`, request);
  }

}
