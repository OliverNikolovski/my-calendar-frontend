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
import {CalendarStore} from "../../states/calendar.state";
import {DeletionType} from "../../configs/deletion-type.enum";

@Component({
  templateUrl: 'view-event-details.dialog.html',
  styleUrl: 'view-event-details.dialog.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TitlePipe, DatePipe, MinutesToHoursAndMinutesPipe, MatIcon, MatTooltip]
})
export class ViewEventDetailsDialog {

  readonly #calendarEventService = inject(CalendarEventService);
  readonly #calendarStore = inject(CalendarStore);

  protected readonly data: {
    event: CalendarEvent;
    date: string;
    order: number;
  } = inject(MAT_DIALOG_DATA);
  readonly #matDialogRef = inject(MatDialogRef);
  readonly #matDialog = inject(MatDialog);

  onClose() {
    this.#matDialogRef.close();
  }

  onEdit() {
    // TODO
  }

  onDelete() {
    let type: DeletionType;
    this.#matDialog.open(DeleteEventDialog, {
      width: '25rem',
      height: '15.5rem'
    }).afterClosed()
      .pipe(
        filter(deletionType => deletionType != null),
        tap(deletionType => type = deletionType),
        switchMap(deletionType =>
          this.#calendarEventService.deleteEvent(this.data.event.id, new Date(this.data.date), deletionType, this.data.order))
      )
      .subscribe({
        next: () => {
          if (type === DeletionType.THIS_EVENT) {
            this.#calendarStore.removeSingleInstance(new Date(this.data.date), this.data.event.id)
            this.#matDialogRef.close();
          }
        },
        error: err => console.log(err)
      });
  }

}
