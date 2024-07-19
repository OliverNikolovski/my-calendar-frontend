import {ChangeDetectionStrategy, Component, inject} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {CalendarEvent} from "../../interfaces/calendar-event";
import {TitlePipe} from "../../pipes/title.pipe";
import {DatePipe} from "@angular/common";
import {MinutesToHoursAndMinutesPipe} from "../../pipes/minutes-to-hours-and-minutes.pipe";
import {MatIcon} from "@angular/material/icon";
import {MatTooltip} from "@angular/material/tooltip";
import {DeleteEventDialog} from "../delete-event/delete-event.dialog";
import {filter, switchMap, tap} from "rxjs";
import {CalendarEventService} from "../../services/calendar-event.service";

@Component({
  templateUrl: 'view-event-details.dialog.html',
  styleUrl: 'view-event-details.dialog.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TitlePipe, DatePipe, MinutesToHoursAndMinutesPipe, MatIcon, MatTooltip]
})
export class ViewEventDetailsDialog {

  readonly #calendarEventService = inject(CalendarEventService);
  protected readonly data: {
    event: CalendarEvent;
    date: string;
  } = inject(MAT_DIALOG_DATA);
  readonly #matDialogRef = inject(MatDialogRef);
  readonly #matDialog = inject(MatDialog);

  onClose() {
    this.#matDialogRef.close(null);
  }

  onEdit() {
    // TODO
  }

  onDelete() {
    this.#matDialog.open(DeleteEventDialog, {
      width: '25rem',
      height: '15.5rem'
    }).afterClosed()
      .pipe(
        filter(deletionType => deletionType != null),
        tap(deletionType => console.log(deletionType, typeof deletionType)),
        switchMap(deletionType => this.#calendarEventService.deleteEvent(this.data.event.id, new Date(this.data.date), deletionType))
      )
      .subscribe({
        next: () => console.log('DELETED'),
        error: err => console.log(err)
      });
  }

}
