import {ChangeDetectionStrategy, Component, computed, inject, input} from "@angular/core";
import {CommonModule} from "@angular/common";
import {CalendarEventInstanceInfo} from "../../interfaces/calendar-event-instance-info";
import {InstanceRangeString} from "../../pipes/instance-range-string";
import {MatDialog} from "@angular/material/dialog";
import {ViewEventDetailsDialog} from "../../dialogs/view-event-details/view-event-details.dialog";
import {ActivatedRoute} from "@angular/router";

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
  readonly #matDialog = inject(MatDialog);
  readonly #route = inject(ActivatedRoute);

  calendarEventInstances = input.required<CalendarEventInstanceInfo[]>();
  intervalHeight = input.required<number>();
  intervalDuration = input.required<number>();
  minSlotDuration = input.required<number>();
  pixelsPerMinute = computed(() => this.intervalHeight() / this.intervalDuration());

  eventOffsetTop(instance: CalendarEventInstanceInfo): number {
    const dateParts = instance.date.split('T');
    const [hours, minutes] = dateParts[1].split(':', 2).map(Number);
    const eventStartOffsetInMinutes = hours * 60 + minutes;
    return eventStartOffsetInMinutes * this.pixelsPerMinute();
  }

  eventHeight(instance: CalendarEventInstanceInfo): number {
    return instance.duration * this.pixelsPerMinute() - 5;
  }

  onEventInstanceClicked(instance: CalendarEventInstanceInfo) {
    this.#matDialog.open(ViewEventDetailsDialog, {
      data: {
        event: instance.event,
        instanceDate: instance.date,
        order: instance.order,
        route: this.#route
      },
      width: '600px'
    });
  }
}
