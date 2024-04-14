import {Component, computed, Inject, signal, WritableSignal} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef,} from "@angular/material/dialog";
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {Freq} from "../../rrule/rrule-constants";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatDatepickerModule,} from "@angular/material/datepicker";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, provideNativeDateAdapter} from "@angular/material/core";
import {MatSelectChange, MatSelectModule} from "@angular/material/select";
import {
  addMinutes,
  differenceInMinutes,
  endOfMonth,
  format,
  getDate,
  getDay,
  intervalToDuration,
  set,
  startOfDay,
  startOfMonth
} from "date-fns";
import {Observable, of} from "rxjs";
import {AsyncPipe, DatePipe, NgClass} from "@angular/common";
import {MatCheckbox, MatCheckboxModule} from "@angular/material/checkbox";
import {MatRadioChange, MatRadioGroup, MatRadioModule} from "@angular/material/radio";
import {EventEndType} from "../../configs/event-end-type";
import {DayByIndexPipe} from "../../pipes/day-by-index.pipe";
import {GetDayPipe} from "../../pipes/get-day.pipe";
import {WeekdayDetails} from "../../interfaces/weekday-details";
import {WeekdayDetailsToStringPipe} from "../../pipes/weekday-details-to-string.pipe";
import {EventType} from "@angular/router";

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
    WeekdayDetailsToStringPipe
  ],
  providers: [
    provideNativeDateAdapter(),
    {
      provide: MAT_DATE_LOCALE,
      useValue: 'fr'
    }
  ],
  // providers: [
  //   {
  //     provide: DateAdapter, useClass: MyAdapter
  //   },
  //   {
  //     provide: MAT_DATE_LOCALE,
  //     useValue: 'fr'
  //   }
  // ],
  templateUrl: './create-event.dialog.html',
  styleUrl: './create-event.dialog.scss'
})
export class CreateEventDialog {
  form = this.initForm();
  dates$: Observable<Date[]> = of(this.dates);

  monthlyOptionControl = new FormControl('0');
  eventEndTypeControl = new FormControl(EventEndType.NEVER);

  protected readonly timeFormat = this.data.timeFormat;
  protected readonly Freq = Freq;
  protected readonly EventEndType = EventEndType;
  protected readonly days: WeekDay[] = [
    {index: 0, name: 'Monday', label: 'M', selected: false},
    {index: 1, name: 'Tuesday', label: 'T', selected: false},
    {index: 2, name: 'Wednesday', label: 'W', selected: false},
    {index: 3, name: 'Thursday', label: 'T', selected: false},
    {index: 4, name: 'Friday', label: 'F', selected: false},
    {index: 5, name: 'Saturday', label: 'S', selected: false},
    {index: 6, name: 'Sunday', label: 'S', selected: false}
  ];

  private readonly eventStartTime = signal(this.data.start, {equal: this.compareByTime});
  private readonly eventEndTime = signal(this.data.end, {equal: this.compareByTime});
  private readonly duration = computed(() =>
    differenceInMinutes(this.eventEndTime(), this.eventStartTime()));

  constructor(private readonly dialogRef: MatDialogRef<CreateEventDialog>,
              private readonly formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA)
              protected data: {
                start: Date;
                end: Date;
                slotDuration: number;
                timeFormat: string;
                weekdayDetails: WeekdayDetails;
              }
  ) {
    dialogRef.updateSize('35rem', '35rem');
    const dayIndex = getDay(data.start) - 1;
    const transformedDayIndex = dayIndex < 0 ? 6 : dayIndex;
    this.days[transformedDayIndex].selected = true;
  }

  private initForm(): FormGroup {
    return this.formBuilder.group({
      title: [''],
      startDate: [this.data.start, [Validators.required]],
      endDate: [{value: this.data.end, disabled: true}],
      // startTime: [this.data.start, [Validators.required]],
      // endTime: [this.data.end],
      isRepeating: [false, [Validators.required]],
      occurrenceCount: [{value: 1, disabled: true}],
      recurrenceRule: this.formBuilder.group({
        freq: [Freq.DAILY],
        interval: [1],
        weekDays: this.formBuilder.array([...Array(7)].map(_ => this.formBuilder.control(false)))
      })
    });
  }

  onClose() {
    this.dialogRef.close(false);
  }

  onSave() {
    console.log(this._eventCreationRequest);
  }

  private get _eventCreationRequest(): any {
    return {
      ...this.form.value,
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

  onEventEndTypeChange(event: MatRadioChange) {
    if (event.value === EventEndType.NEVER) {
      this.endDateControl.disable();
      this.occurrenceCountControl.disable();
    } else if (event.value === EventEndType.ON_DATE) {
      this.endDateControl.enable();
      this.occurrenceCountControl.disable();
    } else { // EventEndType.AFTER_N_OCCURRENCES
      this.endDateControl.disable();
      this.occurrenceCountControl.enable();
    }
  }

  get isRepeatingControl(): AbstractControl {
    return this.form.get('isRepeating')!;
  }

  get freqControl(): AbstractControl {
    return this.form.get('recurrenceRule.freq')!;
  }

  get startDateControl(): AbstractControl {
    return this.form.get('startDate')!;
  }

  get endDateControl(): AbstractControl {
    return this.form.get('endDate')!;
  }

  get occurrenceCountControl(): AbstractControl {
    return this.form.get('occurrenceCount')!;
  }

  get weekDays(): FormArray {
    return this.form.get('recurrenceRule.weekDays')! as FormArray;
  }

  onWeekDaySelected(day: WeekDay) {
    day.selected = !day.selected;
  }

  onEventStartTimeChange(event: MatSelectChange) {
    const date = event.value as Date;
    const startDateWithChangedTime = set(this.startDateControl.value, {
      hours: date.getHours(),
      minutes: date.getMinutes(),
      seconds: date.getSeconds()
    });
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
}
