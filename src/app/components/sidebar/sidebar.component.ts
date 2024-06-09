import {ChangeDetectionStrategy, Component, EventEmitter, Output} from '@angular/core';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatDatepickerModule} from "@angular/material/datepicker";
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
  selected: Date | null = new Date();

  @Output() dateChange = new EventEmitter<Date | null>();

  onDateChange(date: Date | null) {
    this.dateChange.emit(date);
  }
}
