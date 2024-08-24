import {inject, Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {SelectOption} from "../interfaces/select-option";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  readonly #url = 'api/users';
  readonly #http = inject(HttpClient);

  findFirstNMatches(n: number, q: string): Observable<SelectOption[]> {
    return this.#http.get<SelectOption[]>(`${this.#url}/search?n=${n}&q=${q}`);
  }

  isAuthenticatedUserCalendarPublic(): Observable<boolean> {
    return this.#http.get<boolean>(`${this.#url}/is-calendar-public`);
  }

}
