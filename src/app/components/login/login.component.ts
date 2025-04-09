import {ChangeDetectionStrategy, Component, inject, signal} from "@angular/core";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {AuthenticationService} from "../../services/authentication.service";
import {Router, RouterLink} from "@angular/router";
import {MatIconModule} from "@angular/material/icon";
import {CalendarAnimationComponent} from "../calendar-animation/calendar-animation.component";

@Component({
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
    RouterLink,
    CalendarAnimationComponent
  ],
    styleUrl: 'login.component.scss'
})
export class LoginComponent {

  readonly #authService = inject(AuthenticationService);
  readonly #router = inject(Router);
  readonly #fb = inject(FormBuilder);

  hide = signal(true);

  loginForm: FormGroup = this.#fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });
  errorMessage = signal('');

  onSubmit() {
    this.#authService.login({
      email: this.emailControl.value,
      password: this.passwordControl.value
    }).subscribe({
      next: response => {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        localStorage.setItem('username', response.username)
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
