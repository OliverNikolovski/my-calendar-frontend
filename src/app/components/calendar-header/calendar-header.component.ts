import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  output,
  signal
} from "@angular/core";
import {MatIconModule} from "@angular/material/icon";
import {DatePipe} from "@angular/common";
import {CalendarView} from "../../configs/calendar-view";
import {CalendarNavigationComponent} from "../calendar-navigation/calendar-navigation.component";
import {UserService} from "../../services/user.service";
import {MatTooltip} from "@angular/material/tooltip";
import {ConfirmDialog} from "../../dialogs/confirm/confirm.dialog";
import {filter, switchMap} from "rxjs";
import {CalendarEventService} from "../../services/calendar-event.service";
import {CalendarStore} from "../../states/calendar.state";
import {ToastrService} from "ngx-toastr";
import {MatDialog} from "@angular/material/dialog";

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-calendar-header',
  templateUrl: './calendar-header.component.html',
  imports: [
    MatIconModule,
    DatePipe,
    CalendarNavigationComponent,
    MatTooltip
  ],
  styleUrl: 'calendar-header.component.scss'
})
export class CalendarHeaderComponent implements OnInit {
  readonly #userService = inject(UserService);
  readonly #calendarEventService = inject(CalendarEventService);
  readonly #calendarStore = inject(CalendarStore);
  readonly #toastrService = inject(ToastrService);
  readonly #matDialog = inject(MatDialog);

  date = input<Date>(new Date());
  firstDayOfMonthAdded = input<boolean>(false);
  dateChange = output<Date>();
  calendarView = input.required<CalendarView>();
  isCalendarPublic = signal(false);

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
}
