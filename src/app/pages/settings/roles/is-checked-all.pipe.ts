import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isCheckedAll',
})
export class IsCheckedAllPipe implements PipeTransform {
  transform(value: any[], ...args: unknown[]): unknown {
    return value && value.find((value) => !value.checked) ? false : true;
  }
}
