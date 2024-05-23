import {ApplicationConfig} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {provideNativeDateAdapter} from "@angular/material/core";
import { provideHttpClient } from "@angular/common/http";

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAnimationsAsync(), provideHttpClient(), provideNativeDateAdapter({
    parse: {
      dateInput: 'dd-MM-yyyy',
    },
    display: {
      dateInput: 'dd-MM-yyyy',
      monthYearLabel: 'MMM yyyy',
      dateA11yLabel: 'LLLL dd, yyyy',
      monthYearA11yLabel: 'MMMM yyyy',
    },
  })]
};
