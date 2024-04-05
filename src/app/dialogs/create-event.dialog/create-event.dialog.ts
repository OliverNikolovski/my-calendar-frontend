import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef,} from "@angular/material/dialog";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Freq} from "../../rrule/rrule-constants";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatDatepickerModule,} from "@angular/material/datepicker";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {provideNativeDateAdapter} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {addMinutes, startOfDay} from "date-fns";
import {Observable, of} from "rxjs";
import {AsyncPipe, DatePipe} from "@angular/common";
import {TimeConfig} from "../../configs/time-config";

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    AsyncPipe,
    DatePipe
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './create-event.dialog.html',
  styleUrl: './create-event.dialog.scss'
})
export class CreateEventDialog {
  form = this.initForm();
  dates$: Observable<Date[]> = of(this.dates);
  readonly timeFormat = this.data.timeFormat;

  constructor(private readonly dialogRef: MatDialogRef<CreateEventDialog>,
              private readonly formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA)
              private data: {
                start: Date;
                end: Date;
                slotDuration: number;
                timeFormat: string;
              }
  ) {
    this.dialogRef.updateSize('30rem', '35rem');
  }

  private initForm(): FormGroup {
    return this.formBuilder.group({
      title: ['', [Validators.required]],
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

  get timeIntervals(): string[] {
    const times: string[] = [];
    for (let minutes = 0; minutes < 1440; minutes += this.data.slotDuration) { // 1440 minutes in a day
      const hours = Math.floor(minutes / 60);
      const remainingMinutesInHour = minutes % 60;
      const hoursStr = hours.toString().padStart(2, '0');
      const remainingMinsStr = remainingMinutesInHour.toString().padStart(2, '0');
      times.push(`${hoursStr}:${remainingMinsStr}`);
    }
    return times;
  }

  private get dates(): Date[] {
    const dates: Date[] = [];
    let date = startOfDay(new Date());
    let timeIntervalCount = (24 * 60) / this.data.slotDuration;
    while (timeIntervalCount > 0) {
      dates.push(date);
      date = addMinutes(date, this.data.slotDuration);
      timeIntervalCount--;
    }
    return dates;
  }

}
