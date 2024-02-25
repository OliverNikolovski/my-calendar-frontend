import {Component, OnInit} from '@angular/core';
import {DayColumnComponent} from "../day-column/day-column.component";
import {addDays, startOfWeek} from "date-fns";
import {WeekDayPipe} from "../../pipes/week-day.pipe";

const components = [DayColumnComponent];
const pipes = [WeekDayPipe]

@Component({
  selector: 'app-calendar-grid',
  standalone: true,
  imports: [...components, ...pipes],
  templateUrl: './calendar-grid.component.html',
  styleUrl: './calendar-grid.component.scss'
})
export class CalendarGridComponent implements OnInit {

  days: Date[] = [];

  ngOnInit(): void {
    const today = new Date();
    const firstDayOfWeek = startOfWeek(today, { weekStartsOn: 1 });
    const dates: Date[] = [];
    for (let i = 0; i < 7; i++) {
      dates.push(addDays(firstDayOfWeek, i));
    }
    this.days = dates;
  }

}
