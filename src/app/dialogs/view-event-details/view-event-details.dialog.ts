import {ChangeDetectionStrategy, Component, inject} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {CalendarEvent} from "../../interfaces/calendar-event";
import {TitlePipe} from "../../pipes/title.pipe";
import {DatePipe} from "@angular/common";
import {MinutesToHoursAndMinutesPipe} from "../../pipes/minutes-to-hours-and-minutes.pipe";
import {MatIcon} from "@angular/material/icon";
import {MatTooltip} from "@angular/material/tooltip";
import {DeleteEventDialog} from "../delete-event/delete-event.dialog";
import {filter} from "rxjs";

@Component({
  templateUrl: 'view-event-details.dialog.html',
  styleUrl: 'view-event-details.dialog.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TitlePipe, DatePipe, MinutesToHoursAndMinutesPipe, MatIcon, MatTooltip]
})
export class ViewEventDetailsDialog {

  protected readonly data: {
    event: CalendarEvent
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
      .pipe(filter(deletionType => deletionType != null))
      .subscribe(deletionType => this.#matDialogRef.close())
  }

}
