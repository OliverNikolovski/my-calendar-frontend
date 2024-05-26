import {ChangeDetectionStrategy, Component, inject, Input, OnInit} from '@angular/core';
import {WeeklyCalendarComponent} from "../calendar-grid/weekly-calendar.component";
import {SidebarComponent} from "../sidebar/sidebar.component";
import {DayColumnComponent} from "../day-column/day-column.component";
import {ComponentStore} from "@ngrx/component-store";
import {CalendarEvent} from "../../interfaces/calendar-event";
import { set } from 'date-fns';
import {CalendarEventService} from "../../services/calendar-event.service";
import {CalendarEventInstancesContainer} from "../../interfaces/calendar-event-instances-container";

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
  instanceContainers: CalendarEventInstancesContainer[] = [];
  test = 10;

  private readonly _calendarEventService = inject(CalendarEventService)

  @Input() intervalHeight: number = 80;
  @Input() intervalDuration: number = 60;
  @Input() slotDuration: number = 15;

  ngOnInit() {
    this.test = 70;
    this._calendarEventService.getInstancesForEvents(new Date(2024, 4, 1, 0, 0, 0, 0))
      .subscribe(containers => {
        this.instanceContainers = containers;
        this.test = 69;
        console.log('A VO PARENT:',this.instanceContainers);
      });
    setInterval(() => this.test = 1234, 1000);
  }

  onDateChange(date: Date | null) {
    this.selectedDate = date;
  }
}
