import {ChangeDetectionStrategy, Component, computed, inject, input} from "@angular/core";
import {CommonModule} from "@angular/common";
import {CalendarEventInstanceInfo} from "../../interfaces/calendar-event-instance-info";
import {InstanceRangeString} from "../../pipes/instance-range-string";
import {MatDialog} from "@angular/material/dialog";
import {ViewEventDetailsDialog} from "../../dialogs/view-event-details/view-event-details.dialog";
import {CalendarStore} from "../../states/calendar.state";

@Component({
  selector: 'day-events',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'day-events.component.html',
  imports: [
    CommonModule,
    InstanceRangeString
  ],
  styleUrl: 'day-events.component.scss'
})
export class DayEventsComponent {
  #matDialog = inject(MatDialog);

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
    return instance.duration * this.pixelsPerMinute() - 5;
  }

  onEventInstanceClicked(instance: CalendarEventInstanceInfo) {
    this.#matDialog.open(ViewEventDetailsDialog, {
      data: {
        event: instance.event,
        date: instance.date,
        order: instance.order
      },
      width: '600px'
    });
  }
}
