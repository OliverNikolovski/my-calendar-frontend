import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private router = inject(Router);


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const token = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

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
    if (!token && !refreshToken) {
      this.router.navigate(['/login']);
      return false;
    }

    // If logged in, allow access to the requested route
    return true;
  }
}
