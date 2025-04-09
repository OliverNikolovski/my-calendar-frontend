import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from "@angular/forms";
import {catchError, debounceTime, distinctUntilChanged, map, Observable, of, switchMap, take} from "rxjs";
import {CalendarAnimationComponent} from "../calendar-animation/calendar-animation.component";
import {MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatIcon} from "@angular/material/icon";
import {MatButton, MatIconButton} from "@angular/material/button";
import {UserPublicService} from "../../services/user-public.service";
import {Router, RouterLink} from "@angular/router";
import {AuthenticationService} from "../../services/authentication.service";
import {RegistrationRequest} from "../../interfaces/requests/registration.request";
import {ToastrService} from "ngx-toastr";

const imports: any[] = [
  ReactiveFormsModule,
  MatLabel,
  CalendarAnimationComponent,
  MatFormField,
  MatInput
];

const passwordsMatchValidator = (control: AbstractControl): ValidationErrors | null => {
  const form = control as FormGroup;
  const password = form.get('password') as FormControl<string>;
  const repeatedPassword = form.get('repeatedPassword') as FormControl<string>;
  return password.value === repeatedPassword.value ? null : {passwordsDoNotMatch: true}
}

@Component({
  selector: 'app-register',
  templateUrl: 'register.component.html',
  styleUrl: 'register.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    imports,
    MatIcon,
    MatIconButton,
    MatSuffix,
    MatButton,
    RouterLink
  ]
})
export class RegisterComponent {
  readonly #fb = inject(FormBuilder);
  readonly #userPublicService = inject(UserPublicService);
  readonly #authService = inject(AuthenticationService);
  readonly #router = inject(Router);
  readonly #toastService = inject(ToastrService);

  uniqueUsernameValidator = (control: AbstractControl): Observable<ValidationErrors | null> => {
    return control.valueChanges
      .pipe(
        debounceTime(2000),
        distinctUntilChanged(),
        take(1),
        switchMap(value => this.#userPublicService.usernameExists(value)
          .pipe(
            catchError(() => of(null))
          )
        ),
        map(exists => exists ? {usernameExists: true} : null)
      )
  }

  protected readonly form = this.#fb.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    username: ['', [Validators.required, Validators.email], [this.uniqueUsernameValidator]],
    password: ['', [Validators.required, Validators.min(6)]],
    repeatedPassword: ['', [Validators.required, Validators.min(6)]]
  }, {
    validators: passwordsMatchValidator
  });

  showPasswordPressed = signal(false);
  showRepeatedPasswordPressed = signal(false);
  passwordVisibilityIcon = computed(() =>
    this.showPasswordPressed() ? 'visibility' : 'visibility_off');
  repeatedPasswordVisibilityIcon = computed(() =>
    this.showRepeatedPasswordPressed() ? 'visibility' : 'visibility_off');
  passwordType = computed(() =>
    this.showPasswordPressed() ? 'text' : 'password');
  repeatedPasswordType = computed(() =>
    this.showRepeatedPasswordPressed() ? 'text' : 'password');

  onShowPasswordClicked() {
    this.showPasswordPressed.update(value => !value);
  }

  onShowRepeatedPasswordClicked() {
    this.showRepeatedPasswordPressed.update(value => !value);
  }

  onSubmit() {
    this.#authService.register(this.form.value as RegistrationRequest)
      .subscribe({
        next: response => {
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('refreshToken', response.refreshToken);
          localStorage.setItem('username', response.username);
          this.#router.navigate(['/']);
        },
        error: err => this.#toastService.error(err.message)
      });
  }
}
