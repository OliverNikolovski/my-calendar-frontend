import {Pipe, PipeTransform} from "@angular/core";
import {addMinutes, format} from "date-fns";

@Pipe({
  name: 'instanceRangeString',
  standalone: true
})
export class InstanceRangeString implements PipeTransform {

    transform(startDate: string, duration: number): string {
      const [startHours, startMinutes] = startDate.split('T')[1].split(':', 2).map(Number);
      const totalEndTimeInMinutes = (startHours * 60 + startMinutes) + duration;
      const endHour = Math.floor(totalEndTimeInMinutes / 60);
      const endMinute = totalEndTimeInMinutes % 60;
      const transformedStartHour = startHours === 0 || startHours === 12 ? 12 : startHours % 12;
      const transformedEndHour = endHour === 0 || endHour === 12 ? 12 : endHour % 12;
      const transformedStartHourPadded = transformedStartHour.toString().padStart(2, '0');
      const transformedEndHourPadded = transformedEndHour.toString().padStart(2, '0');
      const startMinutePadded = startMinutes.toString().padStart(2, '0');
      const endMinutePadded = endMinute.toString().padStart(2, '0');
      const startAmPm = startHours < 12 ? 'am' : 'pm';
      const endAmPm = endHour < 12 ? 'am' : 'pm';
      return `${transformedStartHourPadded}:${startMinutePadded} ${startAmPm} - ${transformedEndHourPadded}:${endMinutePadded} ${endAmPm}`;
    }

}
