import {Component, Input} from '@angular/core';
import {WeekDayPipe} from "../../pipes/week-day.pipe";

@Component({
  selector: 'app-day-column',
  standalone: true,
  imports: [
    WeekDayPipe
  ],
  templateUrl: './day-column.component.html',
  styleUrl: './day-column.component.scss',
  host: {
    '(mousedown)': 'onmousedown($event)',
    '(mouseup)': 'onmouseup($event)',
    '(mousemove)': 'onmousemove($event)'
  }
})
export class DayColumnComponent {
  @Input({ required: true }) date!: Date;
  draggable: boolean = false;
  start: number | null = null;
  end: number | null = null;
  y: number | null = null;

  onmousedown(event: MouseEvent) {
    this.draggable = true;
    this.start = event.y;
  }

  onmouseup(event: MouseEvent) {
    this.draggable = false;
    this.end = event.y;
  }

  onmousemove(event: MouseEvent) {
    if (this.draggable) {
      console.log('x:', event.x, 'y:', event.y);
    }
  }
}
