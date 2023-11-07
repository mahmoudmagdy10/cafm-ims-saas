import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cutLongString',
})
export class CutLongStringPipe implements PipeTransform {
  transform(value: string, length: number): any {
    return value?.length > length ? value?.substring(0, length) + '...' : value;
  }
}
