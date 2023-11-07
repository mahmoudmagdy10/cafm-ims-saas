import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationComponentComponent } from './pagination-component.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, TranslateModule,ReactiveFormsModule],
  declarations: [PaginationComponentComponent],
  exports: [PaginationComponentComponent],
})
export class PaginationComponentModule {}
