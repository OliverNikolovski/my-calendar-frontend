import {
  ChangeDetectionStrategy,
  Component,
  effect,
  EventEmitter,
  model,
  output,
  Output,
  ViewChild
} from '@angular/core';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatCalendar, MatDatepicker, MatDatepickerModule} from "@angular/material/datepicker";
import {provideNativeDateAdapter} from "@angular/material/core";
import {MatCard} from "@angular/material/card";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [MatDatepickerModule, MatCard],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  selected = model(new Date);
  dateChange = output<Date>();
  @ViewChild('calendar') calendar!: MatCalendar<Date>;

  constructor() {
    effect(() => {
      this.calendar.activeDate = this.selected();
    });
  }

  onDateChange(date: Date | null) {
    this.selected.set(date ?? new Date());
    this.dateChange.emit(date ?? new Date());
  }
}
