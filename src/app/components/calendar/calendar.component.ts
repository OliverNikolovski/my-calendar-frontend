import {ChangeDetectionStrategy, Component, inject, Input, OnInit} from '@angular/core';
import {WeeklyCalendarComponent} from "../calendar-grid/weekly-calendar.component";
import {SidebarComponent} from "../sidebar/sidebar.component";
import {DayColumnComponent} from "../day-column/day-column.component";
import {ComponentStore} from "@ngrx/component-store";
import {CalendarEvent} from "../../interfaces/calendar-event";
import { set } from 'date-fns';
import {CalendarEventService} from "../../services/calendar-event.service";

@Component({
  selector: 'app-calendar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  private readonly _calendarEventService = inject(CalendarEventService)

  @Input() intervalHeight: number = 80;
  @Input() intervalDuration: number = 60;
  @Input() slotDuration: number = 15;

  ngOnInit() {
    this._calendarEventService.getEvents(1).subscribe(events => console.log('events', events));
  }

  onDateChange(date: Date | null) {
    this.selectedDate = date;
  }
}
