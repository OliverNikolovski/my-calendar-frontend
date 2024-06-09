import {ChangeDetectionStrategy, Component, inject, Input, OnInit, signal} from '@angular/core';
import {WeeklyCalendarComponent} from "../calendar-grid/weekly-calendar.component";
import {SidebarComponent} from "../sidebar/sidebar.component";
import {DayColumnComponent} from "../day-column/day-column.component";
import {ComponentStore} from "@ngrx/component-store";
import {CalendarEvent} from "../../interfaces/calendar-event";
import { set } from 'date-fns';
import {CalendarEventService} from "../../services/calendar-event.service";
import {CalendarEventInstancesContainer} from "../../interfaces/calendar-event-instances-container";
import {NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
  selector: 'app-calendar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [
    WeeklyCalendarComponent,
    SidebarComponent,
    DayColumnComponent
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent implements OnInit {
  selectedDate: Date | null = new Date();
  calendarEventInstancesContainer = signal<CalendarEventInstancesContainer | null>(null);

  private readonly _calendarEventService = inject(CalendarEventService)

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

  onDateChange(date: Date | null) {
    this.selectedDate = date;
  }
}
