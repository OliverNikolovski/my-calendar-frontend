import {ChangeDetectionStrategy, Component, inject, Input, OnInit} from '@angular/core';
import {WeeklyCalendarComponent} from "../weekly-calendar/weekly-calendar.component";
import {SidebarComponent} from "../sidebar/sidebar.component";
import {DayColumnComponent} from "../day-column/day-column.component";
import {CalendarEventService} from "../../services/calendar-event.service";
import {CalendarHeaderComponent} from "../calendar-header/calendar-header.component";
import {CalendarView} from "../../configs/calendar-view";
import {CalendarStore} from "../../states/calendar.state";
import {MatButtonModule} from "@angular/material/button";
import {Router} from "@angular/router";

@Component({
  selector: 'app-calendar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [
    WeeklyCalendarComponent,
    SidebarComponent,
    DayColumnComponent,
    CalendarHeaderComponent,
    MatButtonModule
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent implements OnInit {
  readonly #calendarStore = inject(CalendarStore);
  readonly #router = inject(Router);

  selectedDate = new Date();
  protected readonly CalendarView = CalendarView;
  protected firstDayOfMonthAdded = false;

  private readonly _calendarEventService = inject(CalendarEventService);

  @Input() intervalHeight: number = 80;
  @Input() intervalDuration: number = 60;
  @Input() slotDuration: number = 15;

  ngOnInit() {
    this._calendarEventService.getCalendarEventInstancesForAuthenticatedUser()
      .subscribe(container => this.#calendarStore.initEventInstances(container));
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
