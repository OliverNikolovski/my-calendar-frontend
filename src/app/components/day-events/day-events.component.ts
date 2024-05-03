import {ChangeDetectionStrategy, Component, effect, inject, input, Input, OnInit} from "@angular/core";
import {CalendarEvent} from "../../interfaces/calendar-event";
import {CommonModule} from "@angular/common";
import {ComponentStore} from "@ngrx/component-store";
import {MousePositionState} from "../../states/mouse-position.state";

@Component({
  selector: 'day-events',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'day-events.component.html',
  imports: [
    CommonModule
  ],
  styleUrl: 'day-events.component.scss'
})
export class DayEventsComponent implements OnInit {
  events = input.required<CalendarEvent[]>();

  @Input({required: true}) intervalHeight!: number;
  @Input({required: true}) intervalDuration!: number;
  @Input({required: true}) minSlotDuration!: number;

  constructor() {
  }

  ngOnInit() {
  }

  eventOffsetTop(event: CalendarEvent): number {
    const eventStartOffsetInMinutes = event.from.getHours() * 60 + event.from.getMinutes();
    const eventStartInterval = Math.floor(eventStartOffsetInMinutes / this.intervalDuration);
    const eventStartIntervalRemainder = eventStartOffsetInMinutes % this.intervalDuration;
    const intervalStartPx = eventStartInterval * this.intervalHeight;
    const remainderPx = eventStartIntervalRemainder * this.intervalHeight;
    const eventStartOffset = intervalStartPx + remainderPx;

    return eventStartOffset; // TODO
  }

  eventHeight(event: CalendarEvent): number {
    const numberOfIntervalsInEvent = Math.floor(event.duration / this.intervalDuration);
    const remainder = event.duration % this.intervalDuration;
    const eventHeightInIntervals = numberOfIntervalsInEvent + remainder;
    const eventHeightPx = eventHeightInIntervals * this.intervalHeight;

    return eventHeightPx; // TODO
  }
}
