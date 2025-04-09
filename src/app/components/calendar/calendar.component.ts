import {ChangeDetectionStrategy, Component, DestroyRef, inject, Input, OnInit} from '@angular/core';
import {WeeklyCalendarComponent} from "../weekly-calendar/weekly-calendar.component";
import {SidebarComponent} from "../sidebar/sidebar.component";
import {CalendarEventService} from "../../services/calendar-event.service";
import {CalendarHeaderComponent} from "../calendar-header/calendar-header.component";
import {CalendarView} from "../../configs/calendar-view";
import {CalendarStore} from "../../states/calendar.state";
import {MatButtonModule} from "@angular/material/button";
import {ActivatedRoute, Router} from "@angular/router";
import {switchMap} from "rxjs";
import {ToastrService} from "ngx-toastr";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-calendar',
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [
    WeeklyCalendarComponent,
    SidebarComponent,
    CalendarHeaderComponent,
    MatButtonModule
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent implements OnInit {
  readonly #calendarStore = inject(CalendarStore);
  readonly #router = inject(Router);
  readonly #route = inject(ActivatedRoute);
  readonly #toastrService = inject(ToastrService);
  readonly #destroyRef = inject(DestroyRef);

  selectedDate = new Date();
  protected readonly CalendarView = CalendarView;
  protected firstDayOfMonthAdded = false;

  private readonly _calendarEventService = inject(CalendarEventService);

  @Input() intervalHeight: number = 80;
  @Input() intervalDuration: number = 60;
  @Input() slotDuration: number = 15;

  ngOnInit() {
    this.#route.paramMap
      .pipe(
        switchMap(paramMap => paramMap.has('userId') ?
          this._calendarEventService.getCalendarEventInstancesForUser(+paramMap.get('userId')!) :
          this._calendarEventService.getCalendarEventInstancesForAuthenticatedUser()
        ),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe({
        next: eventContainer => this.#calendarStore.initEventContainer(eventContainer),
        error: err => {
          console.log(err);
          // TODO: check why fails when user is idle
          //this.#toastrService.error("There was a problem while fetching the events.");
        }
      });
  }

  onDateChange(date: Date) {
    this.selectedDate = date;
  }

  onFirstDayOfMonthAdded(value: boolean) {
    this.firstDayOfMonthAdded = value;
  }

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.#router.navigate(['/login']);
  }
}
