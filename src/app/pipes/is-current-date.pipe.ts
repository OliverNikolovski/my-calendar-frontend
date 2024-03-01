import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'isCurrentDate',
  standalone: true
})
export class IsCurrentDatePipe implements PipeTransform {

  transform(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  }

}
