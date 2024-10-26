import { Component, computed, signal, inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef,} from "@angular/material/dialog";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatDatepickerModule,} from "@angular/material/datepicker";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {
  provideNativeDateAdapter
} from "@angular/material/core";
import {MatSelectChange, MatSelectModule} from "@angular/material/select";
import {
  addMinutes,
  differenceInMinutes,
  format,
  set,
  startOfDay,
} from "date-fns";
import {Observable, of} from "rxjs";
import {AsyncPipe, DatePipe, NgClass} from "@angular/common";
import {MatCheckboxChange, MatCheckboxModule} from "@angular/material/checkbox";
import {MatRadioModule} from "@angular/material/radio";
import {EventEndType} from "../../configs/event-end-type";
import {DayByIndexPipe} from "../../pipes/day-by-index.pipe";
import {GetDayPipe} from "../../pipes/get-day.pipe";
import {WeekdayDetails} from "../../interfaces/weekday-details";
import {WeekdayDetailsToStringPipe} from "../../pipes/weekday-details-to-string.pipe";
import {endDateAfterStartDateValidator} from "./create-event-validators";
import {CalendarEventCreateRequest} from "../../interfaces/requests/calendar-event-create.request";
import {
  RepeatingPatternControl
} from "../../custom-form-controls/repeating-pattern-form-control/repeating-pattern.control";
import {RepeatingPattern} from "../../interfaces/repeating-pattern";

interface WeekDay {
  index: number;
  name: string;
  label: string;
  selected: boolean;
}

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
    DatePipe,
    MatCheckboxModule,
    MatRadioModule,
    DayByIndexPipe,
    NgClass,
    GetDayPipe,
    WeekdayDetailsToStringPipe,
    RepeatingPatternControl
  ],
  providers: [
    provideNativeDateAdapter()
  ],
  templateUrl: './create-event.dialog.html',
  styleUrl: './create-event.dialog.scss'
})
export class CreateEventDialog {
  private readonly dialogRef = inject<MatDialogRef<CreateEventDialog>>(MatDialogRef);
  private readonly formBuilder = inject(FormBuilder);
  protected data = inject(MAT_DIALOG_DATA);

  private readonly eventStartTime = signal(this.data.start, {equal: this.compareByTime});
  private readonly eventEndTime = signal(this.data.end, {equal: this.compareByTime});
  private readonly duration = computed(() =>
    differenceInMinutes(this.eventEndTime(), this.eventStartTime()));
  form = this.initForm();
  dates$: Observable<Date[]> = of(this.dates);

  protected readonly timeFormat = this.data.timeFormat;

  constructor() {
    const dialogRef = this.dialogRef;

    dialogRef.updateSize('35rem', '35rem');
  }

  private initForm(): FormGroup {
    return this.formBuilder.group({
      title: [''],
      description: [''],
      startDate: [this.data.start, [Validators.required]],
      isRepeating: [false, [Validators.required]],
    }, {
      validators: [endDateAfterStartDateValidator()]
    });
  }

  onClose() {
    this.dialogRef.close(null);
  }

  onSave() {
    const eventCreatingRequest = this._eventCreationRequest;
    this.dialogRef.close(eventCreatingRequest);
  }

  private get _eventCreationRequest(): CalendarEventCreateRequest {
    return {
      ...this.form.value,
      startDate: format(this.startDateControl.value, "yyyy-MM-dd'T'HH:mm:ssXXX"),
      duration: this.duration()
    }
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

  compareByTime(d1: Date, d2: Date): boolean {
    return d1.getHours() === d2.getHours() && d1.getMinutes() === d2.getMinutes();
  }

  get isRepeatingControl(): AbstractControl {
    return this.form.get('isRepeating')!;
  }

  get startDateControl(): AbstractControl {
    return this.form.get('startDate')!;
  }

  get repeatingPattern(): FormGroup | null {
    return this.form.get('repeatingPattern') as FormGroup;
  }

  onEventStartTimeChange(event: MatSelectChange) {
    const date = event.value as Date;
    const startDateWithChangedTime = set(this.startDateControl.value, {
      hours: date.getHours(),
      minutes: date.getMinutes(),
      seconds: date.getSeconds()
    });
    this.startDateControl.setValue(startDateWithChangedTime);
    this.eventStartTime.set(startDateWithChangedTime);
  }

  onEventEndTimeChange(event: MatSelectChange) {
    const date = event.value as Date;
    const endDateWithChangedTime = set(this.data.end, {
      hours: date.getHours(),
      minutes: date.getMinutes(),
      seconds: date.getSeconds()
    });
    this.eventEndTime.set(endDateWithChangedTime);
  }

  onIsRepeatingChange(event: MatCheckboxChange) {
    if (event.checked) {
      this.isRepeatingControl.setValue(true);
    } else {
      this.isRepeatingControl.setValue(false);
    }
  }

}
