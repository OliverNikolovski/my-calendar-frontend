import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {CalendarEvent} from "../../interfaces/calendar-event";
import {TitlePipe} from "../../pipes/title.pipe";
import {DatePipe} from "@angular/common";
import {MinutesToHoursAndMinutesPipe} from "../../pipes/minutes-to-hours-and-minutes.pipe";
import {MatIcon} from "@angular/material/icon";
import {MatTooltip} from "@angular/material/tooltip";
import {DeleteEventDialog} from "../delete-event/delete-event.dialog";
import {filter, map, pipe, switchMap, tap} from "rxjs";
import {CalendarEventService} from "../../services/calendar-event.service";
import {CalendarStore} from "../../states/calendar.state";
import {UpdateEventDialog} from "../update-event/update-event.dialog";
import {CalendarEventUpdateRequest} from "../../interfaces/requests/calendar-event-update.request";
import {isNotNullOrUndefined} from "../../util/common-utils";
import {rxMethod} from "@ngrx/signals/rxjs-interop";
import {tapResponse} from "@ngrx/component-store";
import {ShareEventDialog} from "../share-event/share-event.dialog";
import {ShareEventSequenceRequest} from "../../interfaces/requests/share-event-sequence.request";
import {ToastrService} from "ngx-toastr";
import {ConfirmDialog} from "../confirm/confirm.dialog";
import {AddEmailNotificationDialog} from "../add-email-notification/add-email-notification.dialog";
import {ActivatedRoute} from "@angular/router";

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
  readonly #toastrService = inject(ToastrService);
  protected readonly data: {
    event: CalendarEvent;
    instanceDate: string;
    order: number;
    route: ActivatedRoute;
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
  showActions = false;

  ngOnInit() {
    this.loadEventContainer(this.shouldLoadEventContainerForSequence);
    this.data.route.paramMap
      .pipe(
        tap(paramMap => console.log(paramMap))
      )
      .subscribe(paramMap => this.showActions = !paramMap.has('userId'));
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
        map(option => ({userId: option.value, sequenceId: this.data.event.sequenceId}) as ShareEventSequenceRequest),
        switchMap(request => this.#calendarEventService.shareEventSequence(request))
      )
      .subscribe({
        next: () => {
          console.log('Successfully shared');
          this.#toastrService.success("Successfully shared.");
        },
        error: err => {
          console.log(err);
          this.#toastrService.error(err.error);
        }
      });
  }

  onEdit() {
    this.#matDialog.open(UpdateEventDialog, {
      width: '30rem',
      height: '35rem',
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
          this.#toastrService.success("Successfully updated.");
          this.#matDialogRef.close();
        },
        error: err => {
          this.#toastrService.error(err.error);
        }
      });
  }

  onDelete() {
    this.#matDialog.open(DeleteEventDialog, {
      width: '25rem',
      height: '15.5rem'
    }).afterClosed()
      .pipe(
        filter(isNotNullOrUndefined),
        switchMap(deletionType =>
          this.#calendarEventService.deleteEvent(this.data.event.id, new Date(this.data.instanceDate), deletionType, this.data.order))
      )
      .subscribe({
        next: () => {
          this.shouldLoadEventContainerForSequence.set(true);
          this.#toastrService.success("Successfully deleted.");
          this.#matDialogRef.close();
        },
        error: err => {
          console.log(err);
          this.#toastrService.error(err.error);
        }
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

  onExport() {
    this.#calendarEventService.downloadCalendar().subscribe((blob: Blob) => {
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);
      a.href = objectUrl;
      a.download = 'calendar.ics';
      a.click();
      URL.revokeObjectURL(objectUrl);
    });
  }

  onUpdateVisibility() {
    const newVisibility = this.data.event.isPublic ? 'private' : 'public';
    this.#matDialog.open(ConfirmDialog, {
      data: {
        confirmationMessage: `Are you sure you want to make the event ${newVisibility}?`
      },
      width: '30rem',
      height: '10rem',
    }).afterClosed()
      .pipe(
        filter(Boolean),
        switchMap(() => this.#calendarEventService.updateEventSequenceVisibility(this.data.event.sequenceId, !this.data.event.isPublic))
      )
      .subscribe({
          next: () => {
            this.#calendarStore.updateSequenceVisibility(this.data.event.sequenceId, !this.data.event.isPublic);
            this.#matDialogRef.close();
            this.#toastrService.success(`Event updated as ${newVisibility}`);
          },
          error: err => this.#toastrService.error(err.error)
        }
      );
  }

  onAddEmailNotification() {
    this.#matDialog.open(AddEmailNotificationDialog, {
      width: '45rem',
      height: '10.5rem',
    }).afterClosed()
      .pipe(
        filter(Boolean),
        switchMap(value => this.#calendarEventService.addOrUpdateEmailNotificationForEvent(this.data.event.id, value))
      )
      .subscribe({
        next: () => {
          this.#matDialogRef.close();
          this.#toastrService.success('Successfully added email notification');
        },
        error: err => {
          this.#toastrService.error(err.error);
          console.log(err);
        }
      });
  }
}
