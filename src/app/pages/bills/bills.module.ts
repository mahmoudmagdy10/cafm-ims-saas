import { CalenderFeildModule } from './../../shared/components/calender-feild/calender-feild/calender-feild.module';
import { ViewDataFilterModule } from './../../shared/components/view-data-filter/view-data-filter.module';
import { SharedModule } from 'src/app/shared/Shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BillsComponent } from './bills.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillsFilter } from './modals/filter/filter.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { DropdownModule } from 'primeng/dropdown';
import { TooltipModule } from 'primeng/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { BillCard } from './modals/bill-card/bill-card.component';
import { ProcurementManagementModule } from '../procurement-management/procurement-management.module';

@NgModule({
  declarations: [BillsComponent, BillsFilter, BillCard],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: BillsComponent,
      },
    ]),
    TranslateModule.forChild(),
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    DropdownModule,
    TooltipModule,
    FormsModule,
    SharedModule,
    ViewDataFilterModule,
    ReactiveFormsModule,
    CalenderFeildModule,
  ],
})
export class BillsModule {}
