import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const token = localStorage.getItem('accessToken');

    console.log('route url',route.url);

    // Check if the user is accessing the login page
    if (route.url[0]?.path === 'login') {
      if (token) {
        // If logged in and trying to access login, redirect to the home page
        this.router.navigate(['/']);
        return false;
      } else {
        // Allow access to the login page if not logged in
        return true;
      }
    }

    // If not logged in, redirect to login page
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    console.log('ALLOW ACCESS')
    // If logged in, allow access to the requested route
    return true;
  }
}