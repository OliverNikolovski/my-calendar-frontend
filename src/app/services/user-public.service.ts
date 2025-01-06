import {inject, Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class UserPublicService {
  readonly #url = 'api/public/users';
  readonly #http = inject(HttpClient);

  usernameExists(username: string): Observable<boolean> {
    const params = new HttpParams().set('username', username);
    return this.#http.get<boolean>(`${this.#url}/username-exists`, {params});
  }

}
