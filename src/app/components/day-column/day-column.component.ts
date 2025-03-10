import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
import {ComponentStore} from "@ngrx/component-store";
import {MousePositionState} from "../../states/mouse-position.state";
import {NgStyle} from "@angular/common";
import {addMinutes, differenceInMinutes, endOfMonth, format, getDate, getDay, startOfDay, startOfMonth} from "date-fns";
import {CreateEventDialog} from "../../dialogs/create-event.dialog/create-event.dialog";
import {MatDialog} from "@angular/material/dialog";
import {WeekdayDetails} from "../../interfaces/weekday-details";
import {DayEventsComponent} from "../day-events/day-events.component";
import {filter, switchMap} from "rxjs";
import {CalendarEventService} from "../../services/calendar-event.service";
import {CalendarStore} from "../../states/calendar.state";

@Component({
  selector: 'app-day-column',
  imports: [
    NgStyle,
    DayEventsComponent
  ],
  templateUrl: './day-column.component.html',
  styleUrl: './day-column.component.scss',
  changeDetection: ChangeDetectionStrategy.Default
})
export class DayColumnComponent implements OnInit, OnDestroy {
  private readonly renderer = inject(Renderer2);
  private readonly hostElement = inject(ElementRef);
  private readonly componentStore = inject<ComponentStore<MousePositionState>>(ComponentStore);
  private readonly matDialog = inject(MatDialog);

  readonly #calendarEventService = inject(CalendarEventService);
  readonly #calendarStore = inject(CalendarStore);

  @Input({required: true}) date!: Date;
  @Input({required: true}) intervals!: Date[];
  @Input({required: true}) intervalHeight!: number;
  @Input({required: true}) intervalDuration!: number;
  @Input({required: true}) slotDuration!: number;
  @Input() calendarGridScrollTop = 0;
  @Input() timeFormat?: string;

  calendarEventInstances = computed(() => {
    const container = this.#calendarStore.calendarEventInstancesContainer();
    return this.#calendarStore.getCalendarEventInstances(this.date, container);
  });

  isDraggingArea: boolean = false;
  startOfClickedSlot: number | null = null;

  @ViewChild('area') area!: ElementRef;

  private mouseDownUnlisten?: () => void;

  ngOnInit() {
    this.componentStore.select(state => state)
      .subscribe(({y, mouseUp}) => this.onMouseMove(y, mouseUp));

    this.mouseDownUnlisten = this.renderer.listen(this.hostElement.nativeElement, 'mousedown', this.onMouseDown.bind(this));
  }

  ngOnDestroy() {
    this.mouseDownUnlisten?.();
  }

  onMouseDown(event: MouseEvent) {
    this.isDraggingArea = true;
    this.startOfClickedSlot = this._getStartOfSlotContaining(event.y);
    this.renderer.setStyle(this.area.nativeElement, 'top', `${this.startOfClickedSlot}px`);
    this.renderer.setStyle(this.area.nativeElement, 'width', `100%`);
  }

  onMouseUp(y: number) {
    this.isDraggingArea = false;
    this.renderer.setStyle(this.area.nativeElement, 'height', `0px`);

    const firstSelectedSlotNumber = this.startOfClickedSlot! / this._slotHeight;
    const numberOfSlotsUntilLastSelectedSlot = Math.floor(y / this._slotHeight);
    const numberOfSlotsInSelection = numberOfSlotsUntilLastSelectedSlot - firstSelectedSlotNumber;
    const minutesInEvent = numberOfSlotsInSelection * this.slotDuration;
    const minutesFromMidnightToFirstSelectedSlot = firstSelectedSlotNumber * this.slotDuration;
    const eventStartTime = addMinutes(startOfDay(this.date), minutesFromMidnightToFirstSelectedSlot);
    const eventEndTime = addMinutes(eventStartTime, minutesInEvent);
    if (differenceInMinutes(eventEndTime, eventStartTime) < this.slotDuration) {
      return;
    }
    // open dialog to select repeating pattern
    const dialogRef = this.matDialog.open(CreateEventDialog, {
      data: {
        start: eventStartTime,
        end: eventEndTime,
        slotDuration: this.slotDuration,
        timeFormat: this.timeFormat,
        weekdayDetails: this._getWeekdayDetails
      }
    });
    dialogRef.afterClosed()
      .pipe(
        filter(Boolean),
        switchMap(request => this.#calendarEventService.createEvent(request)),
        switchMap(eventId => this.#calendarEventService.getEventInstances(eventId))
      )
      .subscribe({
        next: container => {
          this.#calendarStore.mergeCurrentContainerWith(container);
        },
        error: err => console.log(err)
      });
  }

  onMouseMove(y: number, isMouseUp: boolean) {
    if (!this.isDraggingArea)
      return;
    if (isMouseUp) {
      this.onMouseUp(this._getDistanceToCursor(y));
      return;
    }
    const slotY = this._getStartOfSlotContaining(y);
    const height = Math.abs(slotY - this.startOfClickedSlot!);
    const top = Math.min(slotY, this.startOfClickedSlot!);
    this.renderer.setStyle(this.area.nativeElement, 'top', `${top}px`);
    this.renderer.setStyle(this.area.nativeElement, 'height', `${height}px`);
  }

  private get _getWeekdayDetails(): WeekdayDetails {
    // Formatting the date to get the weekday name
    const weekdayName = format(this.date, 'EEEE'); // e.g., 'Monday'

    // Getting the first day of the month
    const firstDayOfMonth = startOfMonth(this.date);

    // Getting the day of the week for the first day of the month (0-6, Sun-Sat)
    const startDayOfWeek = getDay(firstDayOfMonth);

    // Date of the given day
    const dateDay = getDate(this.date);

    // Calculating the index of the week in the month
    const weekIndex = Math.ceil((dateDay + startDayOfWeek) / 7);

    // Finding if it's the last occurrence of this weekday in the month
    // We'll get the total days in the month and check if the next occurrence of this day exceeds the month
    const lastDayOfMonth = getDate(endOfMonth(this.date));
    const isLast = dateDay + 7 > lastDayOfMonth;

    // Adjusting the ordinal term (e.g., "first", "second") based on the weekIndex
    const ordinals = ["first", "second", "third"];
    const ordinal = weekIndex <= ordinals.length ? ordinals[weekIndex - 1] : 'last';
    const occurrence = isLast ? 'last' : ordinal;
    const position = occurrence === 'first' ? 1 : occurrence === 'second' ? 2 : occurrence === 'third' ? 3 : -1;

    return {weekdayName, occurrence, position};
  }

  private _getStartOfSlotContaining(y: number): number {
    const distanceToMouseCursor = this._getDistanceToCursor(y);
    const orderNumberOfClickedSlot = Math.floor(distanceToMouseCursor / this._slotHeight);
    return this._slotHeight * orderNumberOfClickedSlot;
  }

  private _getDistanceToCursor(y: number): number {
    const bcr: DOMRect = (this.hostElement.nativeElement as HTMLElement).getBoundingClientRect();
    return y - bcr.y; // the vertical distance from the top of weekly-calendar to the mouse click;
  }

  private get _slotHeight(): number {
    const numberOfSlotsInInterval = this.intervalDuration / this.slotDuration;
    return this.intervalHeight / numberOfSlotsInInterval;
  }
}
