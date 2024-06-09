import {Component, computed, inject, Inject, OnInit, signal, WritableSignal} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef,} from "@angular/material/dialog";
import {
  AbstractControl, DefaultValueAccessor,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup, NG_VALUE_ACCESSOR,
  ReactiveFormsModule, ValidationErrors, ValidatorFn,
  Validators
} from "@angular/forms";
import {Freq} from "../../rrule/rrule-constants";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatDatepickerModule,} from "@angular/material/datepicker";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatOptionSelectionChange,
  provideNativeDateAdapter
} from "@angular/material/core";
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
import {MatCheckboxChange, MatCheckboxModule} from "@angular/material/checkbox";
import {MatRadioChange, MatRadioModule} from "@angular/material/radio";
import {EventEndType} from "../../configs/event-end-type";
import {DayByIndexPipe} from "../../pipes/day-by-index.pipe";
import {GetDayPipe} from "../../pipes/get-day.pipe";
import {WeekdayDetails} from "../../interfaces/weekday-details";
import {WeekdayDetailsToStringPipe} from "../../pipes/weekday-details-to-string.pipe";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {endDateAfterStartDateValidator} from "./create-event-validators";
import {CalendarEventCreateRequest} from "../../interfaces/requests/calendar-event-create.request";
import {
  RepeatingPatternControl
} from "../../custom-form-controls/repeating-pattern-form-control/repeating-pattern.control";

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
export class CreateEventDialog implements OnInit {
  private readonly eventStartTime = signal(this.data.start, {equal: this.compareByTime});
  private readonly eventEndTime = signal(this.data.end, {equal: this.compareByTime});
  private readonly duration = computed(() =>
    differenceInMinutes(this.eventEndTime(), this.eventStartTime()));
  form = this.initForm();
  dates$: Observable<Date[]> = of(this.dates);

  monthlyOptionControl = new FormControl<string>('0');
  eventEndTypeControl = new FormControl<EventEndType>(EventEndType.NEVER);

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
    this.weekDays.setValue([this.days[transformedDayIndex].index]);

    this.repeatingPattern.disable();
    this.weekDays.disable();

    this.frequencyControl.valueChanges.pipe(
      takeUntilDestroyed()
    ).subscribe(freq => {
      if (freq === Freq.WEEKLY) {
        this.weekDays.enable();
        this.setPos.disable();
      } else if (freq === Freq.MONTHLY) {
        this.weekDays.disable();
        this.monthlyOptionControl.value === '1' ? this.setPos.enable() : this.setPos.disable();
      } else {
        this.weekDays.disable();
        this.setPos.disable();
      }
    });

    this.monthlyOptionControl.valueChanges.pipe(
      takeUntilDestroyed()
    ).subscribe(value => {
      if (value === '1' && this.frequencyControl.value === Freq.MONTHLY) {
        this.setPos.setValue(this.data.weekdayDetails.position);
        this.setPos.enable();
      } else {
        this.setPos.disable();
      }
    });
  }

  ngOnInit() {
  }

  private initForm(): FormGroup {
    return this.formBuilder.group({
      title: [''],
      startDate: [this.data.start, [Validators.required]],
      isRepeating: [false, [Validators.required]],
      // repeatingPattern: this.formBuilder.group({
      //   frequency: [Freq.DAILY],
      //   interval: [1],
      //   weekDays: [[]],
      //   setPos: [null],
      //   occurrenceCount: [1],
      //   endDate: [this.data.end]
      // })
    }, {
      validators: [endDateAfterStartDateValidator()]
    });
  }

  onClose() {
    this.dialogRef.close(null);
  }

  onSave() {
    const eventCreatingRequest = this._eventCreationRequest;
    console.log(eventCreatingRequest);
    this.dialogRef.close(eventCreatingRequest);
  }

  private get _eventCreationRequest(): CalendarEventCreateRequest {
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
      this.endDateControl.setValue(this.startDateControl.value);
      this.occurrenceCountControl.disable();
    } else { // EventEndType.AFTER_N_OCCURRENCES
      this.endDateControl.disable();
      this.occurrenceCountControl.enable();
    }
  }

  get isRepeatingControl(): AbstractControl {
    return this.form.get('isRepeating')!;
  }

  get frequencyControl(): AbstractControl {
    return this.form.get('repeatingPattern.frequency')!;
  }

  get startDateControl(): AbstractControl {
    return this.form.get('startDate')!;
  }

  get endDateControl(): AbstractControl {
    return this.form.get('repeatingPattern.endDate')!;
  }

  get occurrenceCountControl(): AbstractControl {
    return this.form.get('repeatingPattern.occurrenceCount')!;
  }

  get weekDays(): AbstractControl {
    return this.form.get('repeatingPattern.weekDays')!;
  }

  get repeatingPattern(): FormGroup {
    return this.form.get('repeatingPattern')! as FormGroup;
  }

  get setPos(): AbstractControl {
    return this.form.get('repeatingPattern.setPos')!;
  }

  onWeekDaySelected(day: WeekDay) {
    day.selected = !day.selected;
    if (day.selected) {
      this.weekDays.setValue([...this.weekDays.value, day.index]);
    } else {
      this.weekDays.setValue((this.weekDays.value as number[]).filter(i => i !== day.index));
    }
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
      this.repeatingPattern.enable();
      this.weekDays.disable();
      this.setPos.disable();
      this.occurrenceCountControl.disable();
      this.endDateControl.disable();
    } else {
      this.repeatingPattern.disable();
    }
  }

  // startEndTimesErrorValidator(): ValidatorFn {
  //   return () => {
  //     console.log('START TIME', this.eventStartTime(), 'END TIME ',this.eventEndTime());
  //     return this.eventStartTime() > this.eventEndTime() ? { startEndTimesError: true } : null;
  //   }
  // }

  // startEndTimesErrorValidator: () => ValidatorFn =
  //   () => (control: AbstractControl): ValidationErrors | null => this.eventStartTime() > this.eventEndTime() ? { startEndTimesError: true } : null;


}
