import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'minToHour',
})
export class MinToHourPipe implements PipeTransform {
  transform(mins: number | string, ...args: unknown[]): unknown {
    var hours = (Math.floor(+mins / 60))||0;
    var minutes = (+mins % 60)||0;
    return hours+'H'+' '+minutes+'m' ;
  }
}
