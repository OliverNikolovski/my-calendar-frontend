import {Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Freq} from "../../rrule/rrule-constants";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {provideNativeDateAdapter} from "@angular/material/core";

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatDatepickerToggle,
    MatDatepicker,
    MatDatepickerInput,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatIcon,
    MatLabel
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './create-event.dialog.html',
  styleUrl: './create-event.dialog.scss'
})
export class CreateEventDialog {
  form = this.initForm();

  constructor(private readonly dialogRef: MatDialogRef<CreateEventDialog>,
              private readonly formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) private data: { start: Date, end: Date }
  ) {
  }

  private initForm(): FormGroup {
    return this.formBuilder.group({
      start: [this.data.start, [Validators.required]],
      end: [this.data.end],
      isRepeating: [false, [Validators.required]],
      recurrenceRule: this.formBuilder.group({
        freq: [Freq.DAILY],
        interval: [1],
        weekDays: [[]],
        occurrenceCount: [null],
        ruleText: ['']
      })
    });
  }

  onClose() {
    this.dialogRef.close(false);
  }
}
