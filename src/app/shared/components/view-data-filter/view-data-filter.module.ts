import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewDataFilterComponent } from './view-data-filter.component';

@NgModule({
  imports: [CommonModule, TranslateModule],
  declarations: [ViewDataFilterComponent],
  exports:[ViewDataFilterComponent]
})
export class ViewDataFilterModule {}
