import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'chartFirst',
})
export class ChartFirstPipe implements PipeTransform {
  transform(value: any, ...args: unknown[]): unknown {
    return value?.charAt(0);
  }
}
