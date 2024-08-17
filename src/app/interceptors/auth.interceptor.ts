import {HttpRequest, HttpEvent, HttpHandlerFn} from '@angular/common/http';
import {catchError, Observable, switchMap, tap, throwError} from 'rxjs';
import {inject} from "@angular/core";
import {AuthenticationService} from "../services/authentication.service";
import {Router} from "@angular/router";

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const token = localStorage.getItem('accessToken');
  const authService = inject(AuthenticationService);
  const router = inject(Router);
  // If the token exists, clone the request and add the Authorization header
  if (token) {
    //const hasToken = req.headers.has('accessToken')
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedReq).pipe(
      catchError(error => {
        if (error.status === 401 && error.error === 'Token expired') {
          localStorage.setItem('accessToken', localStorage.getItem('refreshToken')!);
          return authService.refreshToken().pipe(
            tap(({accessToken, refreshToken}) => {
              localStorage.setItem('accessToken', accessToken);
              localStorage.setItem('refreshToken', refreshToken);
            }),
            switchMap(({accessToken, refreshToken}) => {
              const clonedReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${accessToken}`
                }
              });
              return next(clonedReq);
            }),
            catchError(err => {
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              router.navigate(['/login']);
              return throwError(() => new Error(`Error handling expired access token: ${error}`));
            })
          )
        }
        return throwError(() => new Error(error.error))
      })
    );
  }

  // If no token, continue with the original request
  return next(req);
}
