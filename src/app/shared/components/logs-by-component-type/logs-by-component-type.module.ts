import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogsByComponentTypeComponent } from './logs-by-component-type.component';
import { PaginationComponentModule } from '../pagination-component/pagination-component.module';

@NgModule({
  declarations: [LogsByComponentTypeComponent],
  imports: [CommonModule, TranslateModule, PaginationComponentModule],
  exports: [LogsByComponentTypeComponent, PaginationComponentModule],
})
export class LogsByComponentTypeModule {}
