import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isImage',
})
export class IsImagePipe implements PipeTransform {
  arrTypes: any = [
    'apng',
    'avif',
    'gif',
    'jpg',
    'jpeg',
    'jfif',
    'pjpeg',
    'pjp',
    'png',
    'svg',
    'webp',
  ];
  transform(value: string, ...args: unknown[]): boolean {
    let isImage = this.arrTypes.includes(value) ? true : false;
    return isImage;
  }
}
