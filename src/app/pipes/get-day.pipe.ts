import {Pipe, PipeTransform} from "@angular/core";
import {getDate, getDay} from "date-fns";

@Pipe({
  standalone: true,
  name: 'getDay'
})
export class GetDayPipe implements PipeTransform {

  transform(date: Date): number {
    return getDate(date);
  }

}
