import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {CalendarEvent} from "../../interfaces/calendar-event";
import {TitlePipe} from "../../pipes/title.pipe";
import {DatePipe} from "@angular/common";
import {MinutesToHoursAndMinutesPipe} from "../../pipes/minutes-to-hours-and-minutes.pipe";
import {MatIcon} from "@angular/material/icon";
import {MatTooltip} from "@angular/material/tooltip";
import {DeleteEventDialog} from "../delete-event/delete-event.dialog";
import {filter, map, Observable, pipe, switchMap, tap} from "rxjs";
import {CalendarEventService} from "../../services/calendar-event.service";
import {CalendarStore} from "../../states/calendar.state";
import {ActionType} from "../../configs/deletion-type.enum";
import {UpdateEventDialog} from "../update-event/update-event.dialog";
import { format } from "date-fns";
import {CalendarEventUpdateRequest} from "../../interfaces/requests/calendar-event-update.request";
import {isNotNullOrUndefined} from "../../util/common-utils";
import {CalendarEventInstancesContainer} from "../../interfaces/calendar-event-instances-container";
import {rxMethod} from "@ngrx/signals/rxjs-interop";
import {tapResponse} from "@ngrx/component-store";
import {ShareEventDialog} from "../share-event/share-event.dialog";
import {ShareEventSequenceRequest} from "../../interfaces/requests/share-event-sequence.request";

@Component({
  templateUrl: 'view-event-details.dialog.html',
  styleUrl: 'view-event-details.dialog.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TitlePipe, DatePipe, MinutesToHoursAndMinutesPipe, MatIcon, MatTooltip]
})
export class ViewEventDetailsDialog implements OnInit {

  readonly #calendarEventService = inject(CalendarEventService);
  readonly #calendarStore = inject(CalendarStore);

  protected readonly data: {
    event: CalendarEvent;
    instanceDate: string;
    order: number;
  } = inject(MAT_DIALOG_DATA);
  readonly #matDialogRef = inject(MatDialogRef);
  readonly #matDialog = inject(MatDialog);
  shouldLoadEventContainerForSequence = signal<boolean>(false);
  loadEventContainer = rxMethod<boolean>(
    pipe(
      filter(Boolean),
      switchMap(sequenceId => this.#calendarEventService.getInstancesForSequence(this.data.event.sequenceId)),
      tapResponse({
        next: container => this.#calendarStore.updateContainer(this.data.event.sequenceId, container),
        error: console.log
      })
    )
  );

  ngOnInit() {
    this.loadEventContainer(this.shouldLoadEventContainerForSequence);
  }

  onClose() {
    this.#matDialogRef.close();
  }

  onShare() {
    this.#matDialog.open(ShareEventDialog, {
      width: '25rem',
      height: '15.5rem',
    }).afterClosed()
      .pipe(
        filter(isNotNullOrUndefined),
        map(option => ({ userId: option.value, sequenceId: this.data.event.sequenceId }) as ShareEventSequenceRequest),
        switchMap(request => this.#calendarEventService.shareEventSequence(request))
      )
      .subscribe({
        next: () => console.log('Successfully shared'),
        error: err => console.log(err)
      });
  }

  onEdit() {
    this.#matDialog.open(UpdateEventDialog, {
      width: '25rem',
      height: '15.5rem',
      data: {
        instanceDate: this.data.instanceDate,
        duration: this.data.event.duration
      }
    }).afterClosed()
      .pipe(
        filter(isNotNullOrUndefined),
        map(value => this.mapToUpdateRequest(value)),
        switchMap(request => this.#calendarEventService.updateEvent(request))
      )
      .subscribe({
        next: () => {
          this.shouldLoadEventContainerForSequence.set(true);
          this.#matDialogRef.close();
        },
        error: err => console.log(err)
      });
  }

  onDelete() {
    let type: ActionType;
    this.#matDialog.open(DeleteEventDialog, {
      width: '25rem',
      height: '15.5rem'
    }).afterClosed()
      .pipe(
        filter(isNotNullOrUndefined),
        tap(deletionType => type = deletionType),
        switchMap(deletionType =>
          this.#calendarEventService.deleteEvent(this.data.event.id, new Date(this.data.instanceDate), deletionType, this.data.order))
      )
      .subscribe({
        next: () => {
          this.shouldLoadEventContainerForSequence.set(true);
          this.#matDialogRef.close();
        },
        error: err => console.log(err)
      });
  }

  mapToUpdateRequest(partial: Partial<CalendarEventUpdateRequest>): CalendarEventUpdateRequest {
    return {
      eventId: this.data.event.id,
      fromDate: this.data.instanceDate,
      actionType: partial.actionType!,
      newStartDate: partial.newStartDate!,
      newDuration: partial.newDuration!
    }
  }

}
