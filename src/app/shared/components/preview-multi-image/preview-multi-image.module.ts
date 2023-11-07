import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreviewMultiImageComponent } from './preview-multi-image.component';
import { GalleriaModule } from 'primeng/galleria';

@NgModule({
  imports: [CommonModule, GalleriaModule],
  declarations: [PreviewMultiImageComponent],
  exports: [GalleriaModule, PreviewMultiImageComponent],
})
export class PreviewMultiImageModule {}
