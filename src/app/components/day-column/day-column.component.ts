import {AfterViewInit, Component, ElementRef, Input, Renderer2, ViewChild} from '@angular/core';
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
export class DayColumnComponent implements AfterViewInit {
  @Input({ required: true }) date!: Date;
  draggable: boolean = false;
  start: number | null = null;
  end: number | null = null;
  //y: number | null = null;
  eventDiv: HTMLElement | null = null;

  @ViewChild('area') area!: ElementRef;

  constructor(private _renderer: Renderer2) {
  }

  ngAfterViewInit() {
    //console.log('area', this.area);
  }

  onmousedown(event: MouseEvent) {
    console.log('area', this.area);
    this.draggable = true;
    this.start = event.y;
    this._renderer.setStyle(this.area.nativeElement, 'top', `${this.start}px`);
    this._renderer.setStyle(this.area.nativeElement, 'width', `100%`);
    // this.eventDiv = this._renderer.createElement('div') as HTMLElement;
    // this._renderer.setStyle(this.eventDiv, 'background-color', 'blue');
    // this._renderer.setStyle(this.eventDiv, 'width', '100%');
    // this._renderer.setStyle(this.eventDiv, 'height', '0px');
  }

  onmouseup(event: MouseEvent) {
    this.draggable = false;
    this.end = event.y;
  }

  onmousemove(event: MouseEvent) {
    if (this.draggable) {
      const height = event.y - this.start!!;
      this._renderer.setStyle(this.area.nativeElement,  'height', `${height}px`);
      //this._renderer.setStyle(this.eventDiv, 'height', `${height}px`);
    }
  }
}
