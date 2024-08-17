import {inject, Injectable} from "@angular/core";
import {AuthenticationRequest} from "../interfaces/requests/authentication.request";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {AuthenticationResponse} from "../interfaces/responses/authentication.response";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  readonly #http = inject(HttpClient);

  readonly #url = 'api/auth';

  login(request: AuthenticationRequest): Observable<AuthenticationResponse> {
    return this.#http.post<AuthenticationResponse>(`${this.#url}/login`, request);
  }

  refreshToken(): Observable<AuthenticationResponse> {
    return this.#http.post<AuthenticationResponse>(`${this.#url}/refresh-token`, {});
  }

}
