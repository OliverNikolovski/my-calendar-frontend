import {ChangeDetectionStrategy, Component} from "@angular/core";

@Component({
  selector: 'app-calendar-animation',
  templateUrl: 'calendar-animation.component.html',
  styleUrl: 'calendar-animation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarAnimationComponent {
  monthNames = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  today = new Date();
  month = this.monthNames[this.today.getMonth()];
  day = this.today.getDate();
}
