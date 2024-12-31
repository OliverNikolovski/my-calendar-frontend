import {ChangeDetectionStrategy, Component, computed, input, model} from "@angular/core";
import {CalendarView} from "../../configs/calendar-view";
import {DatePipe} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {MatButton} from "@angular/material/button";
import {addDays, addMonths, addWeeks, format, isSameMonth, lastDayOfMonth, startOfWeek, subWeeks} from "date-fns";

@Component({
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
  showNextMonth = input(false);
  formattedDate = computed(() => {
    switch (this.calendarView()) {
      case CalendarView.DAILY:
        return '';
      case CalendarView.WEEKLY:
        if (this.showNextMonth()) {
          const nextMonth = addMonths(this.dateInput(), 1);
          return `${format(this.dateInput(), 'MMMM')} - ${format(nextMonth, 'MMMM')} ${this.dateInput().getFullYear()}`;
        } else {
          return format(this.dateInput(), 'MMMM y');
        }
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

  setDateToToday() {
    this.dateInput.set(new Date());
  }

  private formatMonthRange(date: Date) {
    // Get the last day of the month for the given date
    const lastDay = lastDayOfMonth(date);

    // Check if any of the last 7 days of the month are in the next month
    let nextMonthIncluded = false;
    for (let i = 0; i < 7; i++) {
      const dayToCheck = addDays(lastDay, -i);
      if (!isSameMonth(dayToCheck, lastDay)) {
        nextMonthIncluded = true;
        break;
      }
    }

    // Format the date as needed
    if (nextMonthIncluded) {
      const nextMonth = addDays(lastDay, 1);
      return `${format(date, 'MMMM')} - ${format(nextMonth, 'MMMM yyyy')}`;
    } else {
      return format(date, 'MMMM yyyy');
    }
  }
}
