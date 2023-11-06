import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tooltipForTask',
})
export class TooltipForTaskPipe implements PipeTransform {
  transform(value: any): any {
    return `<span>-Task Number: ${value.InternalNumber}</span>
    <span>-Task Name: ${value.TaskName}</span>
   <span class="viewImageInEditor">-Description: ${
     value.TaskDescription?.split(' ', 25)?.join(' ') || ''
   } </span>
 `;
  }
}
