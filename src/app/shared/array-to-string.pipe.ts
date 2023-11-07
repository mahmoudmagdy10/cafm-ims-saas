import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'arrayToString',
})
export class ArrayToStringPipe implements PipeTransform {
    transform(data: any[], args: string = ','): any {
        return data.join(args);
    }
}
