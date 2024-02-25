import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'weekDay',
  standalone: true
})
export class WeekDayPipe implements PipeTransform {

  transform(dayOfWeek: number): string {
    switch (dayOfWeek) {
      case 0:
        return 'sun';
      case 1:
        return 'mon';
      case 2:
        return 'tue';
      case 3:
        return 'wed';
      case 4:
        return 'thu';
      case 5:
        return 'fri';
      case 6:
        return 'sat';
      default:
        return '';
    }
  }

}
