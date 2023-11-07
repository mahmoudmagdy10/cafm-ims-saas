import { ViewDataFilterModule } from './../../shared/components/view-data-filter/view-data-filter.module';
import { SharedModule } from 'src/app/shared/Shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcurementManagementComponent } from './procurement-management.component';
import { ProcurementManagementFilter } from './modals/filter/filter.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialogModule } from '@angular/material/dialog';
import { AddProcurementOrder } from './modals/add-procurement-order/add-procurement-order.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { DropdownModule } from 'primeng/dropdown';
import { procurementOrderCard } from './modals/procurement-order-card/procurement-order-card.component';
import { TabViewModule } from 'primeng/tabview';
import { AddReceipt } from './modals/procurement-order-card/modals/add-receipt/add-receipt.component';
import { BudgetManagement } from './modals/budget-management/budget-management.component';
import { AddBudget } from './modals/budget-management/add-budget/add-budget.component';
import { TooltipModule } from 'primeng/tooltip';
import { BasicInfoComponent } from './modals/procurement-order-card/Tabs/basic-info/basic-info.component';
import { RuqestForginServiceOrSparePartModule } from 'src/app/shared/components/ruqest-forgin-service-or-spare-part/ruqest-forgin-service-or-spare-part.module';
import { ItemsComponent } from './modals/procurement-order-card/Tabs/items/items.component';
import { MovmentHistoryComponent } from './modals/procurement-order-card/Tabs/movment-history/movment-history.component';
import { BillsComponent } from './modals/procurement-order-card/Tabs/bills/bills.component';
import { AddImageBudgetComponent } from './modals/budget-management/add-budget/add-image-budget/add-image-budget.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { CalenderFeildModule } from 'src/app/shared/components/calender-feild/calender-feild/calender-feild.module';

@NgModule({
  declarations: [
    ProcurementManagementComponent,
    ProcurementManagementFilter,
    AddProcurementOrder,
    procurementOrderCard,
    AddReceipt,
    BudgetManagement,
    AddBudget,
    BasicInfoComponent,
    ItemsComponent,
    MovmentHistoryComponent,
    BillsComponent,
    AddImageBudgetComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: ProcurementManagementComponent,
      },
    ]),
    TranslateModule.forChild(),
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    DropdownModule,
    TabViewModule,
    TooltipModule,
    ReactiveFormsModule,
    SharedModule,
    RuqestForginServiceOrSparePartModule,
    FormsModule,
    ImageCropperModule,
    CalenderFeildModule,
    ViewDataFilterModule,
  ],
  exports: [
    procurementOrderCard,
    AddReceipt,
    BasicInfoComponent,
    ItemsComponent,
    MovmentHistoryComponent,
    BillsComponent,
  ],
})
export class ProcurementManagementModule {}
