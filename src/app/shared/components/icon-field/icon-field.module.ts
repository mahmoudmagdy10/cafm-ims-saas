import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconFieldComponent } from './icon-field.component';
import { TooltipModule } from 'primeng/tooltip';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [IconFieldComponent],
  imports: [
    CommonModule,
    FormsModule,
    TooltipModule,
    TranslateModule.forChild(),
  ],

  exports: [IconFieldComponent],
})
export class IconFieldModule {}
