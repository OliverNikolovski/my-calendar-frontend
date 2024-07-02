import {ChangeDetectionStrategy, Component, computed, effect, input, output} from "@angular/core";
import {MatIconModule} from "@angular/material/icon";
import {DatePipe} from "@angular/common";
import {CalendarView} from "../../configs/calendar-view";
import {CalendarNavigationComponent} from "../calendar-navigation/calendar-navigation.component";
import {MatButtonModule} from "@angular/material/button";
import {subYears} from "date-fns";

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-calendar-header',
  templateUrl: './calendar-header.component.html',
  imports: [
    MatIconModule,
    DatePipe,
    CalendarNavigationComponent
  ],
  styleUrl: 'calendar-header.component.scss'
})
export class CalendarHeaderComponent {

  date = input<Date>(new Date());
  dateChange = output<Date>();
  calendarView = input.required<CalendarView>();

  onDateInputChanged(date: Date) {
    this.dateChange.emit(date);
  }

}
