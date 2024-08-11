import {ApplicationConfig} from '@angular/core';
import {provideRouter, withComponentInputBinding} from '@angular/router';

import {routes} from './app.routes';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {provideNativeDateAdapter} from "@angular/material/core";
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {authInterceptor} from "./interceptors/auth.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideNativeDateAdapter({
      parse: {
        dateInput: 'dd-MM-yyyy',
      },
      display: {
        dateInput: 'dd-MM-yyyy',
        monthYearLabel: 'MMM yyyy',
        dateA11yLabel: 'LLLL dd, yyyy',
        monthYearA11yLabel: 'MMMM yyyy',
      },
    })
  ]
};
