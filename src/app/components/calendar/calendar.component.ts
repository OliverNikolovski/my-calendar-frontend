import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CalendarGridComponent} from "../calendar-grid/calendar-grid.component";
import {SidebarComponent} from "../sidebar/sidebar.component";

@Component({
  selector: 'app-calendar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CalendarGridComponent,
    SidebarComponent
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent {
  selectedDate: Date | null = new Date();

  onDateChange(date: Date | null) {
    this.selectedDate = date;
  }
}
