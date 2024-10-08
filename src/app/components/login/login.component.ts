import {ChangeDetectionStrategy, Component, inject, signal} from "@angular/core";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {AuthenticationService} from "../../services/authentication.service";
import {Router, RouterLink} from "@angular/router";
import {MatIconModule} from "@angular/material/icon";

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'login.component.html',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    RouterLink
  ],
  styleUrl: 'login.component.scss'
})
export class LoginComponent {

  hide = signal(true);
  readonly #authService = inject(AuthenticationService);
  readonly #router = inject(Router);

  loginForm: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });
  errorMessage = signal('');

  monthNames = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  today = new Date();
  month = this.monthNames[this.today.getMonth()];
  day = this.today.getDate();

  onSubmit() {
    this.#authService.login({
      email: this.emailControl.value,
      password: this.passwordControl.value
    }).subscribe({
      next: response => {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        this.errorMessage.set('');
        this.#router.navigate(['/']);
      },
      error: err => {
        this.errorMessage.set('Incorrect username or password.');
      }
    });
  }

  showPassword(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  get emailControl(): AbstractControl {
    return this.loginForm.get('email')!;
  }

  get passwordControl(): AbstractControl {
    return this.loginForm.get('password')!;
  }

}
