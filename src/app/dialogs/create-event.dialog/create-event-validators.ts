import {AbstractControl, FormGroup, ValidationErrors, ValidatorFn} from "@angular/forms";
import { startOfDay } from "date-fns";

export function endDateAfterStartDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const form = control as FormGroup;
    const startDateControl = form.get('startDate')!;
    const endDateControl = form.get('recurrenceRule.endDate')!;
    const startDate = startOfDay(startDateControl.value);
    const endDate = startOfDay(endDateControl.value);
    if (endDate && endDate < startDate) {
      return { endDateAfterStartDate: true };
    }
    return null;
  }
}
