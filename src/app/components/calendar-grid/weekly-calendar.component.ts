import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component, DoCheck,
  ElementRef, EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
import {DayColumnComponent} from "../day-column/day-column.component";
import {addDays, startOfWeek} from "date-fns";
import {WeekDayPipe} from "../../pipes/week-day.pipe";
import {IsCurrentDatePipe} from "../../pipes/is-current-date.pipe";
import {DatePipe, NgStyle} from "@angular/common";
import {ApplyPipe} from "../../pipes/apply.pipe";
import {ComponentStore} from "@ngrx/component-store";
import {MousePositionState} from "../../states/mouse-position.state";

const components = [DayColumnComponent];
const pipes = [WeekDayPipe, IsCurrentDatePipe, DatePipe, ApplyPipe]

@Component({
  selector: 'app-weekly-calendar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [...components, ...pipes, NgStyle],
  templateUrl: './weekly-calendar.component.html',
  styleUrl: './weekly-calendar.component.scss',
  providers: [ComponentStore],
  host: {
    '(mousedown)': 'onMouseDown($event)'
  }
})
export class WeeklyCalendarComponent implements OnInit, OnDestroy, DoCheck {

  private readonly mouseMoveUnlisten: () => void;
  private readonly mouseUpUnlisten: () => void;

  days: Date[] = [];
  selectedDate!: Date;
  times: Date[] = [];
  isAmPm: boolean = true;
  draggable = false;

  @Input({required: true}) intervalHeight!: number;
  @Input({required: true}) intervalDuration!: number;
  @Input({required: true}) slotDuration!: number;

  @Input({required: true}) set date(date: Date | null) {
    this.selectedDate = date ?? new Date();
    this._changeCurrentDate();
  }

  constructor(private readonly componentStore: ComponentStore<MousePositionState>,
              private readonly renderer: Renderer2) {
    this.mouseMoveUnlisten = this.renderer.listen('document', 'mousemove', this.onMouseMove.bind(this));
    this.mouseUpUnlisten = this.renderer.listen('document', 'mouseup', this.onMouseUp.bind(this));
  }

  ngOnInit(): void {
    this.times = Array.from({ length: 24 }, (_, hour) => {
      const date = new Date();
      date.setHours(hour, 0, 0, 0);
      return date;
    });
  }

  ngDoCheck() {
  }

  ngOnDestroy() {
    this.mouseMoveUnlisten();
    this.mouseUpUnlisten();
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

  onMouseDown(event: MouseEvent) {
    this.draggable = true;
  }

  onMouseMove(event: MouseEvent) {
    this.draggable && this.componentStore.setState({y: event.y, mouseUp: false});
  }

  onMouseUp(event: MouseEvent) {
    if (this.draggable) {
      this.componentStore.setState({y: event.y, mouseUp: true});
      this.draggable = false;
    }
  }
}
