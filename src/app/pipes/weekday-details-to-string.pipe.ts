import {Pipe, PipeTransform} from "@angular/core";
import {WeekdayDetails} from "../interfaces/weekday-details";

@Pipe({
  standalone: true,
  name: 'weekdayDetailsToString'
})
export class WeekdayDetailsToStringPipe implements PipeTransform {

  transform(weekdayDetails: WeekdayDetails): string {
    return `${weekdayDetails.occurrence} ${weekdayDetails.weekdayName}`;
  }

}
