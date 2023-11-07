import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'transformTime',
})
export class TransformTimePipe implements PipeTransform {
  transform(value: number, ...args: unknown[]): unknown {
    var sec_num = value;
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - hours * 3600) / 60);
    var seconds = sec_num - hours * 3600 - minutes * 60;

    return hours + ':' + minutes + ':' + seconds;
  }
}
