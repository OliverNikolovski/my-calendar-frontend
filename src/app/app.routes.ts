import {Routes} from '@angular/router';
import {AppComponent} from "./components/app/app.component";
import {LoginComponent} from "./components/login/login.component";
import {AuthGuard} from "./guards/auth.guard";
import {HomeComponent} from "./components/home/home.component";

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard]
  },
  { // redirect to home for any unknown routes
    path: '**',
    redirectTo: ''
  }
];
