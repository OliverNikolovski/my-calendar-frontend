import {ChangeDetectionStrategy, Component, effect, model, output, viewChild} from '@angular/core';
import {MatCalendar, MatDatepickerModule} from "@angular/material/datepicker";
import {provideNativeDateAdapter} from "@angular/material/core";
import {MatCard} from "@angular/material/card";

@Component({
  selector: 'app-sidebar',
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [MatDatepickerModule, MatCard],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  selected = model(new Date);
  dateChange = output<Date>();
  calendar = viewChild<MatCalendar<Date>>('calendar');

  constructor() {
    effect(() => {
      this.calendar() && (this.calendar()!.activeDate = this.selected());
    });
  }

  onDateChange(date: Date | null) {
    this.selected.set(date ?? new Date());
    this.dateChange.emit(date ?? new Date());
  }
}
