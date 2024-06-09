import {ChangeDetectionStrategy, Component, computed, input} from "@angular/core";
import {CommonModule} from "@angular/common";
import {CalendarEventInstanceInfo} from "../../interfaces/calendar-event-instance-info";

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
export class DayEventsComponent {
  calendarEventInstances = input.required<CalendarEventInstanceInfo[]>();
  intervalHeight = input.required<number>();
  intervalDuration = input.required<number>();
  minSlotDuration = input.required<number>();
  pixelsPerMinute = computed(() => this.intervalHeight() / this.intervalDuration());

  eventOffsetTop(instance: CalendarEventInstanceInfo): number {
    const instanceDate = new Date(instance.date);
    const eventStartOffsetInMinutes = instanceDate.getHours() * 60 + instanceDate.getMinutes();
    return eventStartOffsetInMinutes * this.pixelsPerMinute();
  }

  eventHeight(instance: CalendarEventInstanceInfo): number {
    return instance.duration * this.pixelsPerMinute();
  }
}
