import { SharedModule } from './../../shared/Shared.module';
import { VendorsForSparePartComponent } from './modals/spare-parts-card/tabsCard/vendors-for-spare-parts/vendors-for-spare-parts.component';
import { ReportsSparePartComponent } from './modals/spare-parts-card/tabsCard/reports-spare-parts/reports-spare-parts.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { StoresFilter } from './modals/filter/stores-filter.component';
import { TooltipModule } from 'primeng/tooltip';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { StoreCard } from './modals/spare-parts-card/spare-parts-card.component';
import { DropdownModule } from 'primeng/dropdown';
import { FieldDynamicModule } from '../../shared/components/FieldDynamic/fieldDynamic.module';
import { TabViewModule } from 'primeng/tabview';
import { ViewItemInFieldModule } from 'src/app/shared/components/ViewFieldInItem/view-field-in-item.Module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { StoresManagement } from './modals/stores-management/stores-management.component';
import { AddStore } from './modals/stores-management/add-store/add-store.component';
import { AddBond } from './modals/inventory-and-settlement-bonds/add-bond/add-bond.component';
import { BasicInformtionComponent } from './modals/spare-parts-card/tabsCard/basic-informtion/basic-informtion.component';
import { InventoryManagmentComponent } from './modals/spare-parts-card/tabsCard/inventory-managment/inventory-managment.component';
import { MovmentHistoryComponent } from './modals/spare-parts-card/tabsCard/movment-history/movment-history.component';
import { InventoryAndSettlementBonds } from './modals/inventory-and-settlement-bonds/inventory-and-settlement-bonds.component';
import { SparePartsComponent } from './spare-parts.component';
import { AssetsForSparePartsComponent } from './modals/spare-parts-card/tabsCard/assets-for-spare-parts/assets-for-spare-parts.component';
import { AddSparePartsComponent } from './modals/add-spare-parts/add-spare-parts.component';
import { AddInitialStock } from './modals/spare-parts-card/modelsCard/add-initial-stock/add-initial-stock.component';
import { TransferBetweenWarehouses } from './modals/spare-parts-card/modelsCard/transfer-between-warehouses/transfer-between-warehouses.component';
import { MoveWorkSite } from './modals/spare-parts-card/modelsCard/move-work-site/move-work-site.component';

import { CardSparePartImageComponent } from './modals/spare-parts-card/modelsCard/card-image/card-image.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { LinkWithVendorComponent } from './modals/spare-parts-card/modelsCard/link-with-vendor/link-with-vendor.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { TreeSingleSelectionModule } from 'src/app/shared/components/Tree/tree-single-selection/tree.module';
import { ViewDataFilterComponent } from 'src/app/shared/components/view-data-filter/view-data-filter.component';
import { ViewDataFilterModule } from 'src/app/shared/components/view-data-filter/view-data-filter.module';
import { PaginationComponentModule } from 'src/app/shared/components/pagination-component/pagination-component.module';

@NgModule({
  declarations: [
    SparePartsComponent,
    StoresFilter,
    StoreCard,
    StoresManagement,
    AddStore,
    InventoryAndSettlementBonds,
    AddBond,
    BasicInformtionComponent,
    InventoryManagmentComponent,
    MovmentHistoryComponent,
    AssetsForSparePartsComponent,
    VendorsForSparePartComponent,
    ReportsSparePartComponent,
    AddSparePartsComponent,
    AddInitialStock,
    TransferBetweenWarehouses,
    MoveWorkSite,
    CardSparePartImageComponent,
    LinkWithVendorComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: SparePartsComponent,
      },
    ]),
    TranslateModule.forChild(),
    MatDialogModule,
    TooltipModule,
    MatTooltipModule,
    DropdownModule,
    FieldDynamicModule,
    TabViewModule,
    ViewItemInFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    ImageCropperModule,
    SharedModule,
    MatAutocompleteModule,
    FormsModule,
    TreeSingleSelectionModule,
    SharedModule,
    ViewDataFilterModule,
    PaginationComponentModule,
  ],
  exports: [StoreCard],
})
export class StoresModule {}
