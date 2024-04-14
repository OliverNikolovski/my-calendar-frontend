import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  name: 'dayByIndex',
  standalone: true
})
export class DayByIndexPipe implements PipeTransform {

  transform(index: number): string {
    switch (index) {
      case 0:
        return 'M';
      case 1:
        return 'T';
      case 2:
        return 'W';
      case 3:
        return 'T';
      case 4:
        return 'F';
      case 5:
        return 'S';
      case 6:
        return 'S';
      default:
        return '';
    }
  }

}
