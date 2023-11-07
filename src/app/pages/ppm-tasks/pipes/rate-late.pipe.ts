import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'rateLate',
})
export class RateLatePipe implements PipeTransform {
  transform(value: any, isColor = false) {
    let duration = moment(value).diff(new Date(), 'days');
    if (!isColor) {
      return duration > 0
        ? `(${duration} days left)`
        : `(Delay by ${duration} days)`;
    } else {
      return duration >= 0 ? 'green' : 'red';
    }
  }
}
