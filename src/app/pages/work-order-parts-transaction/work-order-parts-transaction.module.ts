import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkOrderPartsTransactionComponent } from './work-order-parts-transaction.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TabMenuModule } from 'primeng/tabmenu';
import { PaginationComponentModule } from 'src/app/shared/components/pagination-component/pagination-component.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FilterTransactionComponent } from './filter/filter.component';
import { DropdownModule } from 'primeng/dropdown';
import { WorkOrderTableComponent } from './work-order-table/work-order-table.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    ProgressSpinnerModule,
    PaginationComponentModule,
    RouterModule.forChild([
      {
        path: '',
        component: WorkOrderPartsTransactionComponent,
      },
    ]),
    TabMenuModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatAutocompleteModule,
    FormsModule,
    DropdownModule,
  ],
  declarations: [
    WorkOrderPartsTransactionComponent,
    FilterTransactionComponent,
    WorkOrderTableComponent,
  ],
})
export class WorkOrderPartsTransactionModule {}
