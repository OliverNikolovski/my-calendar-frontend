import {ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {DayColumnComponent} from "../day-column/day-column.component";
import {addDays, startOfWeek} from "date-fns";
import {WeekDayPipe} from "../../pipes/week-day.pipe";
import {IsCurrentDatePipe} from "../../pipes/is-current-date.pipe";
import {DatePipe} from "@angular/common";
import {ApplyPipe} from "../../pipes/apply.pipe";
import {ComponentStore} from "@ngrx/component-store";
import {MousePositionState} from "../../states/mouse-position.state";

const components = [DayColumnComponent];
const pipes = [WeekDayPipe]

@Component({
  selector: 'app-calendar-grid',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [...components, ...pipes, IsCurrentDatePipe, DatePipe, ApplyPipe],
  templateUrl: './calendar-grid.component.html',
  styleUrl: './calendar-grid.component.scss',
  providers: [ComponentStore],
  host: {
    '(document:mousemove)': 'onMouseMove($event)'
  }
})
export class CalendarGridComponent implements OnInit {

  days: Date[] = [];
  selectedDate!: Date;
  times: Date[] = [];
  isAmPm: boolean = true;

  @Input({required: true}) set date(date: Date | null) {
    this.selectedDate = date ?? new Date();
    this._changeCurrentDate();
  }

  constructor(private readonly componentStore: ComponentStore<MousePositionState>) {
  }

  ngOnInit(): void {
    this.componentStore.setState({x: 0, y: 0});

    // this.times.push('');
    // for (let i = 1; i <= 11; i++)  {
    //   this.times.push(i + ' AM')
    // }
    // this.times.push('12 PM');
    // for (let i = 1; i <= 11; i++)  {
    //   this.times.push(i + ' PM')
    // }
    this.times = Array.from({ length: 24 }, (_, hour) => {
      const date = new Date();
      date.setHours(hour, 0, 0, 0);
      return date;
    });
  }

  private _changeCurrentDate() {
    const firstDayOfWeek = startOfWeek(this.selectedDate, { weekStartsOn: 1 });
    const dates: Date[] = [];
    for (let i = 0; i < 7; i++) {
      dates.push(addDays(firstDayOfWeek, i));
    }
    this.days = dates;
  }

  changeTimeFormat() {
    this.isAmPm = !this.isAmPm;
  }

  getTimeFormat(amPm: boolean): string {
    return amPm ? 'shortTime' : 'H:mm';
  }

  onMouseMove(event: MouseEvent) {
    this.componentStore.setState({x: event.x, y: event.y});
  }
}
