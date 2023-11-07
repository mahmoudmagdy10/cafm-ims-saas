import { ViewDataFilterModule } from 'src/app/shared/components/view-data-filter/view-data-filter.module';
import { PaginationComponentModule } from 'src/app/shared/components/pagination-component/pagination-component.module';
import { SharedModule } from 'src/app/shared/Shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorsComponent } from './vendors.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FilterComponent } from './modals/filter/filter.component';
import { AddNewVendorComponent } from './modals/addNewVendor/addNewVendor.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { VendorCardComponent } from './modals/vendor-card/vendor-card.component';
import { TabViewModule } from 'primeng/tabview';
import { TooltipModule } from 'primeng/tooltip';
import { ReactiveFormsModule } from '@angular/forms';
import { VendorInfoComponent } from './modals/vendor-card/vendorTabs/vendor-info/vendor-info.component';
import { TaskSharedComponent } from './modals/vendor-card/vendorTabs/task-shared/task-shared.component';
import { AssetsComponent } from './modals/vendor-card/vendorTabs/assets/assets.component';
import { PurchaseOrdersComponent } from './modals/vendor-card/vendorTabs/purchase-orders/purchase-orders.component';
import { ViewItemInFieldModule } from 'src/app/shared/components/ViewFieldInItem/view-field-in-item.Module';
import { movementHistoryVendorComponent } from './modals/vendor-card/vendorTabs/movementHistory/movementHistory.component';
import { AddActionModule } from 'src/app/shared/components/AddAction/add-action.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { SparePartForVendorsComponent } from './modals/vendor-card/vendorTabs/vendors-for-spare-parts/spare-parts-for-vendors.component';
import { LinkWithSparePartComponent } from './modals/vendor-card/vendorTabs/vendors-for-spare-parts/link-with-sparePart/link-with-spare-part.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { TreeSingleSelectionModule } from 'src/app/shared/components/Tree/tree-single-selection/tree.module';
import { SkeletonModule } from 'primeng/skeleton';
import { LogsByComponentTypeModule } from 'src/app/shared/components/logs-by-component-type/logs-by-component-type.module';
@NgModule({
  declarations: [
    VendorsComponent,
    FilterComponent,
    AddNewVendorComponent,
    VendorCardComponent,
    VendorInfoComponent,
    TaskSharedComponent,
    AssetsComponent,
    movementHistoryVendorComponent,
    PurchaseOrdersComponent,
    SparePartForVendorsComponent,
    LinkWithSparePartComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: VendorsComponent,
      },
    ]),
    MatDialogModule,
    DropdownModule,
    TranslateModule.forChild(),
    TabViewModule,
    TooltipModule,
    ReactiveFormsModule,
    ViewItemInFieldModule,
    SharedModule,
    AddActionModule,
    Ng2SearchPipeModule,
    MatAutocompleteModule,
    TreeSingleSelectionModule,
    SkeletonModule,
    LogsByComponentTypeModule,
    PaginationComponentModule,
    ViewDataFilterModule,
  ],
})
export class VendorsModule {}
