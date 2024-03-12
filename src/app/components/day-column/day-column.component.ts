import {
  AfterViewInit, ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input, NgZone,
  OnChanges, OnInit,
  Renderer2,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {WeekDayPipe} from "../../pipes/week-day.pipe";
import {ComponentStore} from "@ngrx/component-store";
import {MousePositionState} from "../../states/mouse-position.state";

@Component({
  selector: 'app-day-column',
  standalone: true,
  imports: [
    WeekDayPipe
  ],
  templateUrl: './day-column.component.html',
  styleUrl: './day-column.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // host: {
  //   '(mousedown)': 'onmousedown($event)',
  //   '(mouseup)': 'onmouseup($event)',
  //   '(mousemove)': 'onmousemove($event)'
  // }
})
export class DayColumnComponent implements AfterViewInit, OnChanges, OnInit {
  @Input({required: true}) date!: Date;
  @Input() calendarGridScrollTop = 0;

  draggable: boolean = false;
  start: number | null = null;
  end: number | null = null;
  //y: number | null = null;
  eventDiv: HTMLElement | null = null;

  @ViewChild('area') area!: ElementRef;

  private mouseDownUnlisten?: () => void;

  constructor(private readonly renderer: Renderer2,
              private readonly elementRef: ElementRef,
              private readonly ngZone: NgZone,
              private readonly componentStore: ComponentStore<MousePositionState>) {
  }

  ngOnInit() {
    this.componentStore.select(state => state)
      .subscribe(({x, y}) => console.log('from day column:', x, y));

    this.mouseDownUnlisten = this.renderer.listen(this.elementRef.nativeElement, 'mousedown', this.onmousedown);
    //this.renderer.
  }

  ngAfterViewInit() {
    //console.log('area', this.area);
  }

  ngOnChanges(changes: SimpleChanges) {
    // if (changes['calendarGridScrollTop']) {
    //   console.log('scroll top', this.calendarGridScrollTop)
    // }
  }

  onmousedown(event: MouseEvent) {
    // console.log('y', event.y);
    // console.log('page y', event.pageY);
    // console.log('offset y', event.offsetY);
    // console.log('screen y', event.screenY);
    //console.log('scroll top', this.calendarGridScrollTop);
    this.draggable = true;
    // this.start = event.y;
    this.start = this.calendarGridScrollTop + event.y - 104;
    this.renderer.setStyle(this.area.nativeElement, 'top', `${this.start}px`);
    this.renderer.setStyle(this.area.nativeElement, 'width', `100%`);
    //this.renderer.setStyle(this.area.nativeElement, 'height', `20px`);

    // this.eventDiv = this.renderer.createElement('div') as HTMLElement;
    // this.renderer.setStyle(this.eventDiv, 'background-color', 'blue');
    // this.renderer.setStyle(this.eventDiv, 'width', '100%');
    // this.renderer.setStyle(this.eventDiv, 'height', '0px');
  }

  onmouseup(event: MouseEvent) {
    this.draggable = false;
    this.end = event.y;
    this.renderer.setStyle(this.area.nativeElement, 'height', `0px`);
  }

  onmousemove(event: MouseEvent) {
    if (this.draggable) {
      //console.log(this.start);
      const height = (this.calendarGridScrollTop + event.y - 104) - this.start!!;
      // console.log('height', height)
      this.renderer.setStyle(this.area.nativeElement, 'height', `${height}px`);
    }
  }
}
