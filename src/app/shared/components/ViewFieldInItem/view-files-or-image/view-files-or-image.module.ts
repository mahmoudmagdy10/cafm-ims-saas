import { ImageModule } from 'primeng/image';
import { SharedModule } from 'src/app/shared/Shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewFilesOrImageComponent } from './view-files-or-image.component';
import {GalleriaModule} from 'primeng/galleria';

@NgModule({
  imports: [CommonModule, SharedModule, ImageModule],
  declarations: [ViewFilesOrImageComponent],
  exports: [ViewFilesOrImageComponent],
})
export class ViewFilesOrImageModule {}
