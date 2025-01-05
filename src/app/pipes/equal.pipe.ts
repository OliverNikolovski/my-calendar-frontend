import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  standalone: true,
  name: 'equals'
})
export class EqualPipe implements PipeTransform {

    transform(first: any, second: any): boolean {
        return first === second;
    }

}
