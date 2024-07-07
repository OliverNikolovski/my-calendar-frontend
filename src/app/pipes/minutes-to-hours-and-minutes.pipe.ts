import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  standalone: true,
  name: 'minutesToHoursAndMinutes'
})
export class MinutesToHoursAndMinutesPipe implements PipeTransform {

  transform(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    let result = '';
    if (hours) {
      result = hours > 1 ? `${hours} hours` : `${hours} hour`;
    }
    if (mins) {
      result = result + ` ${mins} minutes`;
    }
    return result;
  }

}
