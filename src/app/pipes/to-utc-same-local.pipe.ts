import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  standalone: true,
  name: 'toUtcSameLocal'
})
export class ToUtcSameLocalPipe implements PipeTransform {

  transform(dateStr: string): string {
    return dateStr?.replace(/\+.*$/g, 'Z');
  }

}
