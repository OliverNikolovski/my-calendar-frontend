import {Pipe, PipeTransform} from "@angular/core";
import {Month} from "../configs/month.enum";

@Pipe({
  standalone: true,
  name: 'formatDate'
})
export class FormatDatePipe implements PipeTransform {

  transform(dateStr: string): string {
    const [year, month, day] = dateStr.split('T')[0].split('-').map(Number);
    const monthName = Month[month as keyof typeof Month];
    return `${monthName} ${day}, ${year}`;
  }

}
