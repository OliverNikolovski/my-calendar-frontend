import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DoCheck,
  ElementRef,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Renderer2,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {WeekDayPipe} from "../../pipes/week-day.pipe";
import {ComponentStore} from "@ngrx/component-store";
import {MousePositionState} from "../../states/mouse-position.state";
import {NgStyle} from "@angular/common";
import {addMinutes, startOfDay} from "date-fns";
import {startOfToday} from "date-fns/startOfToday";
import {CreateEventDialog} from "../../dialogs/create-event.dialog/create-event.dialog";
import {MatDialog} from "@angular/material/dialog";
import {TimeConfig} from "../../configs/time-config";

@Component({
  selector: 'app-day-column',
  standalone: true,
  imports: [
    WeekDayPipe,
    NgStyle
  ],
  templateUrl: './day-column.component.html',
  styleUrl: './day-column.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DayColumnComponent implements OnInit, OnDestroy {
  @Input({required: true}) date!: Date;
  @Input({required: true}) intervals!: Date[];
  @Input({required: true}) intervalHeight!: number;
  @Input({required: true}) intervalDuration!: number;
  @Input({required: true}) slotDuration!: number;
  @Input() calendarGridScrollTop = 0;
  @Input() timeFormat?: string;

  isDraggingArea: boolean = false;
  startOfClickedSlot: number | null = null;

  @ViewChild('area') area!: ElementRef;

  private mouseDownUnlisten?: () => void;

  constructor(private readonly renderer: Renderer2,
              private readonly hostElement: ElementRef,
              private readonly componentStore: ComponentStore<MousePositionState>,
              private readonly matDialog: MatDialog) {
  }

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
    const eventStartTime = addMinutes(startOfToday(), minutesFromMidnightToFirstSelectedSlot);
    const eventEndTime = addMinutes(eventStartTime, minutesInEvent);
    console.log('eventEndTime',eventEndTime);
    // open dialog to select repeating pattern
    this.matDialog.open(CreateEventDialog, {
      data: {
        start: eventStartTime,
        end: eventEndTime,
        slotDuration: this.slotDuration,
        timeFormat: this.timeFormat
      }
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
