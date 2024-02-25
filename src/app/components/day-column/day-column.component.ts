import {booleanAttribute, Component, Input} from '@angular/core';
import {WeekDayPipe} from "../../pipes/week-day.pipe";

@Component({
  selector: 'app-day-column',
  standalone: true,
  imports: [
    WeekDayPipe
  ],
  templateUrl: './day-column.component.html',
  styleUrl: './day-column.component.scss'
})
export class DayColumnComponent {
  @Input({ required: true }) date!: Date;
}
