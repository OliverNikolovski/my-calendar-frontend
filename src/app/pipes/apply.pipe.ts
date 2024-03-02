import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'apply',
  standalone: true
})
export class ApplyPipe implements PipeTransform {

  transform(value: any, fn: (...args: any[]) => any, ...args: any[]): any {
    if (!fn) {
      return value;
    }
    return fn(value, ...args);
  }

}
