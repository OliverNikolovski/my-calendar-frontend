import {ChangeDetectionStrategy, Component, inject, Input, OnInit, signal} from '@angular/core';
import {WeeklyCalendarComponent} from "../weekly-calendar/weekly-calendar.component";
import {SidebarComponent} from "../sidebar/sidebar.component";
import {DayColumnComponent} from "../day-column/day-column.component";
import {ComponentStore} from "@ngrx/component-store";
import {CalendarEvent} from "../../interfaces/calendar-event";
import { set } from 'date-fns';
import {CalendarEventService} from "../../services/calendar-event.service";
import {CalendarEventInstancesContainer} from "../../interfaces/calendar-event-instances-container";
import {NG_VALUE_ACCESSOR} from "@angular/forms";
import {CalendarHeaderComponent} from "../calendar-header/calendar-header.component";
import {CalendarView} from "../../configs/calendar-view";

@Component({
  selector: 'app-calendar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [
    WeeklyCalendarComponent,
    SidebarComponent,
    DayColumnComponent,
    CalendarHeaderComponent
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent implements OnInit {
  selectedDate = new Date();
  calendarEventInstancesContainer = signal<CalendarEventInstancesContainer | null>(null);
  protected readonly CalendarView = CalendarView;

  private readonly _calendarEventService = inject(CalendarEventService);

  @Input() intervalHeight: number = 80;
  @Input() intervalDuration: number = 60;
  @Input() slotDuration: number = 15;

  ngOnInit() {
    this._calendarEventService.getInstancesForEvents(new Date(2024, 4, 1, 0, 0, 0, 0))
      .subscribe(container => {
        console.log('container', container);
        this.calendarEventInstancesContainer.set(container);
      });
  }

  onDateChange(date: Date) {
    this.selectedDate = date;
  }
}
