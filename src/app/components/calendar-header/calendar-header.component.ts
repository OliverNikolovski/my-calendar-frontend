import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  output, Signal,
  signal, WritableSignal
} from "@angular/core";
import {MatIconModule} from "@angular/material/icon";
import {DatePipe} from "@angular/common";
import {CalendarView} from "../../configs/calendar-view";
import {CalendarNavigationComponent} from "../calendar-navigation/calendar-navigation.component";
import {UserService} from "../../services/user.service";
import {MatTooltip} from "@angular/material/tooltip";
import {ConfirmDialog} from "../../dialogs/confirm/confirm.dialog";
import {debounceTime, distinctUntilChanged, filter, finalize, switchMap} from "rxjs";
import {CalendarEventService} from "../../services/calendar-event.service";
import {CalendarStore} from "../../states/calendar.state";
import {ToastrService} from "ngx-toastr";
import {MatDialog} from "@angular/material/dialog";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from "@angular/material/autocomplete";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {SelectOption} from "../../interfaces/select-option";
import {toSignal} from "@angular/core/rxjs-interop";
import {MatOptionSelectionChange} from "@angular/material/core";
import {Router} from "@angular/router";

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'app-calendar-header',
    templateUrl: './calendar-header.component.html',
    imports: [
        MatIconModule,
        DatePipe,
        CalendarNavigationComponent,
        MatTooltip,
        FormsModule,
        MatAutocomplete,
        MatAutocompleteTrigger,
        MatFormField,
        MatInput,
        MatLabel,
        MatOption,
        ReactiveFormsModule,
        ConfirmDialog
    ],
    styleUrl: 'calendar-header.component.scss'
})
export class CalendarHeaderComponent implements OnInit {
  readonly #userService = inject(UserService);
  readonly #calendarEventService = inject(CalendarEventService);
  readonly #calendarStore = inject(CalendarStore);
  readonly #toastrService = inject(ToastrService);
  readonly #matDialog = inject(MatDialog);
  readonly #router = inject(Router);
  readonly N = 5;

  date = input<Date>(new Date());
  firstDayOfMonthAdded = input<boolean>(false);
  dateChange = output<Date>();
  calendarView = input.required<CalendarView>();
  isCalendarPublic = signal(false);
  filteredOptions: Signal<SelectOption[] | undefined>;
  searchTermControl = new FormControl('');

  constructor() {
    this.filteredOptions = toSignal(
      this.searchTermControl.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter(searchTerm => searchTerm != null && searchTerm.length > 1),
        switchMap(searchTerm => this.#userService.findFirstNMatches(this.N, searchTerm!!))
      )
    )
  }

  ngOnInit() {
    this.#userService.isAuthenticatedUserCalendarPublic()
      .subscribe(isCalendarPublic => this.isCalendarPublic.set(isCalendarPublic));
  }

  onDateInputChanged(date: Date) {
    this.dateChange.emit(date);
  }

  onUpdateVisibility() {
    const newVisibility = this.isCalendarPublic() ? 'private' : 'public';
    this.#matDialog.open(ConfirmDialog, {
      data: {
        confirmationMessage: `Are you sure you want to make the calendar ${newVisibility}?`
      },
      width: '35rem',
      height: '10rem',
    }).afterClosed()
      .pipe(
        filter(Boolean),
        switchMap(() => this.#calendarEventService.updateCalendarVisibility(!this.isCalendarPublic()))
      )
      .subscribe({
          next: () => {
            this.#calendarStore.updateCalendarVisibility(!this.isCalendarPublic());
            this.isCalendarPublic.set(!this.isCalendarPublic());
            this.#toastrService.success(`Calendar updated as ${newVisibility}`);
          },
          error: err => this.#toastrService.error(err.error)
        }
      );
  }

  displayUserOption(option: SelectOption): string {
    return option && option.name ? option.name.toString() : '';
  }

  onSelectionChange(event: MatOptionSelectionChange<SelectOption>) {
    const userId = event.source.value.value as number;
    this.#router.navigate(['/calendar', userId]);
  }

  onFileChange(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files!.item(0);
    if (!file) {
      return;
    }
    this.#matDialog.open(ConfirmDialog, {
      data: {
        confirmationMessage: `Import calendar from file "${file.name}"?`
      }
    }).afterClosed()
      .pipe(
        filter(Boolean),
        finalize(() => fileInput.value = ''),
        switchMap(() => this.#calendarEventService.importCalendar(file))
      )
      .subscribe({
        next: message => this.#toastrService.success(message),
        error: err => {
          console.log('error',err);
          this.#toastrService.error(err.message);
        }
      });
  }
}
