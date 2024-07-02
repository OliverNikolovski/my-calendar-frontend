import {ChangeDetectionStrategy, Component, inject} from "@angular/core";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {CalendarEvent} from "../../interfaces/calendar-event";

@Component({
  templateUrl: 'view-event-details.dialog.html',
  styleUrl: 'view-event-details.dialog.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewEventDetailsDialog {

  protected readonly data: {
    event: CalendarEvent
  } = inject(MAT_DIALOG_DATA);

}
