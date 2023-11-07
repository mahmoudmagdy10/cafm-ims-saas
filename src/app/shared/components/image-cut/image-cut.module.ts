import { TranslateModule } from '@ngx-translate/core';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ImageCutComponent } from './image-cut.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [ImageCutComponent],
  imports: [CommonModule, ImageCropperModule, TranslateModule],
  exports: [ImageCutComponent],
})
export class ImageCutModule {}
