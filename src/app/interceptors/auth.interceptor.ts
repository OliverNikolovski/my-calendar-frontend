import { Injectable } from '@angular/core';
import {HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHandlerFn} from '@angular/common/http';
import { Observable } from 'rxjs';

// @Injectable()
// export class AuthInterceptor implements HttpInterceptor {
//
//   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     // Get the JWT token from local storage
//     const token = localStorage.getItem('accessToken');
//
//     // If the token exists, clone the request and add the Authorization header
//     if (token) {
//       const clonedReq = req.clone({
//         headers: req.headers.set('Authorization', `Bearer ${token}`)
//       });
//
//       return next.handle(clonedReq);
//     }
//
//     // If no token, continue with the original request
//     return next.handle(req);
//   }
// }

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  console.log('vlegov vo interceptor')
  const token = localStorage.getItem('accessToken');
  console.log('token:', token);

  // If the token exists, clone the request and add the Authorization header
  if (token) {
    console.log('token exists')
    const clonedReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    console.log('sending cloned req', clonedReq);
    return next(clonedReq);
  }

  console.log('token does not exist, sending original req', req);
  // If no token, continue with the original request
  return next(req);
}
