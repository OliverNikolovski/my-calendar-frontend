import {Pipe, PipeTransform} from "@angular/core";
import {addMinutes, format} from "date-fns";

@Pipe({
  name: 'instanceRangeString',
  standalone: true
})
export class InstanceRangeString implements PipeTransform {

    transform(startDate: Date | string, duration: number): string {
        const _startDate = new Date(startDate);
        const from = format(_startDate, 'h:mm aaa');
        const to = format(addMinutes(_startDate, duration), 'h:mm aaa');
        return `${from} - ${to}`;
    }

}
