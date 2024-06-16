import {ChangeDetectionStrategy, Component, computed, input, model} from "@angular/core";
import {CalendarView} from "../../configs/calendar-view";
import {DatePipe} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {MatButton} from "@angular/material/button";
import {addWeeks, startOfWeek, subWeeks} from "date-fns";

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-calendar-navigation',
  templateUrl: 'calendar-navigation.component.html',
  imports: [
    DatePipe,
    MatIcon,
    MatButton,
  ],
  styleUrl: 'calendar-navigation.component.scss'
})
export class CalendarNavigationComponent {

  dateInput = model(new Date());
  calendarView = input.required<CalendarView>();
  format = computed(() => {
    switch (this.calendarView()) {
      case CalendarView.DAILY:
        return '';
      case CalendarView.WEEKLY:
        return 'MMMM y';
      case CalendarView.MONTHLY:
        return '';
      default:
        return '';
    }
  });

  onNavigateBefore() {
    let newDate = this.dateInput();
    switch (this.calendarView()) {
      case CalendarView.DAILY:
        break;
      case CalendarView.WEEKLY:
        newDate = this.calculateBeforeDateForWeekly();
        break;
      case CalendarView.MONTHLY:
        break;
      default:
        break;
    }
    this.dateInput.set(newDate);
  }

  onNavigateNext() {
    let newDate = this.dateInput();
    switch (this.calendarView()) {
      case CalendarView.DAILY:
        break;
      case CalendarView.WEEKLY:
        newDate = this.calculateNextDateForWeekly();
        break;
      case CalendarView.MONTHLY:
        break;
      default:
        break;
    }
    this.dateInput.set(newDate);
  }

  private calculateNextDateForWeekly(): Date {
    const newDate = addWeeks(this.dateInput(), 1);
    const mondayDate = startOfWeek(newDate, { weekStartsOn: 1 });
    return mondayDate;
  }

  private calculateBeforeDateForWeekly(): Date {
    const newDate = subWeeks(this.dateInput(), 1);
    const mondayDate = startOfWeek(newDate, { weekStartsOn: 1 });
    return mondayDate;
  }
}
