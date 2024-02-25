import { Component } from '@angular/core';
import {CalendarGridComponent} from "../calendar-grid/calendar-grid.component";

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CalendarGridComponent
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent {

}
