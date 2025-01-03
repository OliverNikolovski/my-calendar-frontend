import {ChangeDetectionStrategy, Component, input} from "@angular/core";
import {
  AbstractControl,
  ControlValueAccessor,
  FormsModule,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator
} from "@angular/forms";
import {MatFormField} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {NgTemplateOutlet} from "@angular/common";

@Component({
  selector: 'add-email-notification',
  templateUrl: 'add-email-notification.component.html',
  imports: [
    FormsModule,
    MatFormField,
    MatInput,
    NgTemplateOutlet
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: AddEmailNotificationComponent,
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: AddEmailNotificationComponent,
      multi: true
    }
  ]
})
export class AddEmailNotificationComponent implements ControlValueAccessor, Validator {

  #minutes: number | null = null;
  protected isDisabled = false;
  #onChange: (value: number | null) => void = () => {
  };
  #onTouched: () => void = () => {
  };

  useShortMessage = input(false);

  get minutes() {
    return this.#minutes;
  }

  set minutes(value: number | null) {
    this.#minutes = value;
    this.#onChange(value);
    this.#onTouched();
  }

  writeValue(minutes: number | null): void {
    this.#minutes = minutes;
  }

  registerOnChange(fn: any): void {
    this.#onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.#onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  validate(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }
    const minutes = +control.value;
    return minutes <= 0 ? {mustBePositive: true} : null;
  }

}
