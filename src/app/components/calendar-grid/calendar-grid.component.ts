import {Component, Input, OnInit} from '@angular/core';
import {DayColumnComponent} from "../day-column/day-column.component";
import {addDays, startOfWeek} from "date-fns";
import {WeekDayPipe} from "../../pipes/week-day.pipe";
import {IsCurrentDatePipe} from "../../pipes/is-current-date.pipe";

const components = [DayColumnComponent];
const pipes = [WeekDayPipe]

@Component({
  selector: 'app-calendar-grid',
  standalone: true,
  imports: [...components, ...pipes, IsCurrentDatePipe],
  templateUrl: './calendar-grid.component.html',
  styleUrl: './calendar-grid.component.scss'
})
export class CalendarGridComponent implements OnInit {

  days: Date[] = [];
  selectedDate!: Date;

  @Input({required: true}) set date(date: Date | null) {
    this.selectedDate = date ?? new Date();
    this._changeCurrentDate();
  }

  ngOnInit(): void {
  }

  private _changeCurrentDate() {
    const firstDayOfWeek = startOfWeek(this.selectedDate, { weekStartsOn: 1 });
    const dates: Date[] = [];
    for (let i = 0; i < 7; i++) {
      dates.push(addDays(firstDayOfWeek, i));
    }
    this.days = dates;
  }

}
