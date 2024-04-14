import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {WeeklyCalendarComponent} from "../calendar-grid/weekly-calendar.component";
import {SidebarComponent} from "../sidebar/sidebar.component";
import {DayColumnComponent} from "../day-column/day-column.component";

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
export class CalendarComponent {
  selectedDate: Date | null = new Date();

  @Input() intervalHeight: number = 80;
  @Input() intervalDuration: number = 60;
  @Input() slotDuration: number = 15;

  onDateChange(date: Date | null) {
    this.selectedDate = date;
  }
}
