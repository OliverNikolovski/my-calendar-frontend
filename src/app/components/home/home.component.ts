import {ChangeDetectionStrategy, Component, effect, input, Input} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {CalendarComponent} from "../calendar/calendar.component";

@Component({
    selector: 'app-home',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CalendarComponent],
    templateUrl: './home.component.html'
})
export class HomeComponent {
}
