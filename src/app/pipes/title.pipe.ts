import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  standalone: true,
  name: 'title'
})
export class TitlePipe implements PipeTransform {

  transform(title?: string | null): string {
    return title ? title : '(No title)';
  }

}
