import {Component, DestroyRef, inject, input, OnDestroy, OnInit} from "@angular/core";
import {
  AbstractControl,
  ControlContainer,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule
} from "@angular/forms";
import {Freq} from "../../rrule/rrule-constants";
import {EventEndType} from "../../configs/event-end-type";
import {GetDayPipe} from "../../pipes/get-day.pipe";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {MatFormField, MatSuffix} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption} from "@angular/material/autocomplete";
import {MatRadioButton, MatRadioChange, MatRadioGroup} from "@angular/material/radio";
import {MatSelect} from "@angular/material/select";
import {WeekdayDetailsToStringPipe} from "../../pipes/weekday-details-to-string.pipe";
import {WeekdayDetails} from "../../interfaces/weekday-details";
import {CommonModule} from "@angular/common";
import {endDateAfterStartDateValidator} from "../../dialogs/create-event.dialog/create-event-validators";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {getDay} from "date-fns";

interface WeekDay {
  index: number;
  name: string;
  label: string;
  selected: boolean;
}

@Component({
  standalone: true,
  selector: 'repeating-pattern',
  templateUrl: './repeating-pattern.control.html',
  styleUrl: './repeating-pattern.control.scss',
  imports: [
    GetDayPipe,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatFormField,
    MatInput,
    MatOption,
    MatRadioButton,
    MatRadioGroup,
    MatSelect,
    MatSuffix,
    ReactiveFormsModule,
    WeekdayDetailsToStringPipe,
    CommonModule
  ],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, {skipSelf: true})
    }
  ]
})
export class RepeatingPatternControl implements OnInit, OnDestroy {
  readonly #controlContainer = inject(ControlContainer);
  readonly formBuilder = inject(FormBuilder);
  readonly #destroyRef = inject(DestroyRef);

  readonly formGroup = this.initForm()
  protected readonly Freq = Freq;
  protected readonly EventEndType = EventEndType;
  monthlyOptionControl = new FormControl<string>('0');
  eventEndTypeControl = new FormControl<EventEndType>(EventEndType.NEVER);
  protected readonly days: WeekDay[] = [
    {index: 0, name: 'Monday', label: 'M', selected: false},
    {index: 1, name: 'Tuesday', label: 'T', selected: false},
    {index: 2, name: 'Wednesday', label: 'W', selected: false},
    {index: 3, name: 'Thursday', label: 'T', selected: false},
    {index: 4, name: 'Friday', label: 'F', selected: false},
    {index: 5, name: 'Saturday', label: 'S', selected: false},
    {index: 6, name: 'Sunday', label: 'S', selected: false}
  ];

  startDate = input.required<Date>();
  endDate = input<Date>();
  weekdayDetails = input.required<WeekdayDetails>();

  constructor() {

  }

  ngOnInit() {
    const dayIndex = getDay(this.startDate()) - 1;
    const transformedDayIndex = dayIndex < 0 ? 6 : dayIndex;
    this.days[transformedDayIndex].selected = true;
    this.weekDays.setValue([this.days[transformedDayIndex].index]);

    this.monthlyOptionControl.valueChanges.pipe(
      takeUntilDestroyed(this.#destroyRef)
    ).subscribe(value => {
      if (value === '1' && this.frequencyControl.value === Freq.MONTHLY) {
        this.setPos.setValue(this.weekdayDetails().position);
        this.setPos.enable();
      } else {
        this.setPos.disable();
      }
    });

    this.frequencyControl.valueChanges.pipe(
      takeUntilDestroyed(this.#destroyRef)
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

    this.weekDays.disable();
    this.setPos.disable();
    this.occurrenceCountControl.disable();
    this.endDateControl.disable();

    this.parentFormGroup.addControl('repeatingPattern', this.formGroup);
  }

  ngOnDestroy() {
    this.parentFormGroup.removeControl('repeatingPattern');
  }

  get parentFormGroup(): FormGroup {
    return this.#controlContainer.control as FormGroup;
  }

  onEventEndTypeChange(event: MatRadioChange) {
    if (event.value === EventEndType.NEVER) {
      this.endDateControl.disable();
      this.occurrenceCountControl.disable();
    } else if (event.value === EventEndType.ON_DATE) {
      this.endDateControl.enable();
      this.endDateControl.setValue(this.startDate);
      this.occurrenceCountControl.disable();
    } else { // EventEndType.AFTER_N_OCCURRENCES
      this.endDateControl.disable();
      this.occurrenceCountControl.enable();
    }
  }

  onWeekDaySelected(day: WeekDay) {
    day.selected = !day.selected;
    if (day.selected) {
      this.weekDays.setValue([...this.weekDays.value, day.index]);
    } else {
      this.weekDays.setValue((this.weekDays.value as number[]).filter(i => i !== day.index));
    }
  }

  private initForm(): FormGroup {
    return this.formBuilder.group({
      frequency: [Freq.DAILY],
      interval: [1],
      weekDays: [[]],
      setPos: [null],
      occurrenceCount: [1],
      endDate: [this.endDate]
    })
  }

  get endDateControl(): AbstractControl {
    return this.formGroup.get('endDate')!;
  }

  get occurrenceCountControl(): AbstractControl {
    return this.formGroup.get('occurrenceCount')!;
  }

  get frequencyControl(): AbstractControl {
    return this.formGroup.get('frequency')!;
  }

  get weekDays(): AbstractControl {
    return this.formGroup.get('weekDays')!;
  }

  get setPos(): AbstractControl {
    return this.formGroup.get('setPos')!;
  }
}
