import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'optionInstrSelrct',
})
export class OptionInstrSelrctPipe implements PipeTransform {
  transform(value: any[], ...args: unknown[]): unknown {

    let options =
      value instanceof Array
        ? value.map((value) => {
            return {
              Name: value.label,
              Code: value.option,
              ID: value.ID,
            };
          })
        : null;

    return options;
  }
}
