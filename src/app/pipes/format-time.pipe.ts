import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  standalone: true,
  name: 'formatTime'
})
export class FormatTimePipe implements PipeTransform {

  transform(dateStr: string): string {
    const [hours, minutes] = dateStr.split('T')[1].split(':', 2).map(Number);
    const transformedHours = hours === 0 || hours === 12 ? 12 : hours % 12;
    const amPm = hours < 12 ? 'AM' : 'PM';
    const hoursStr = transformedHours.toString().padStart(2, '0');
    const minStr = minutes.toString().padStart(2, '0');
    return `${hoursStr}:${minStr} ${amPm}`;
  }

}
