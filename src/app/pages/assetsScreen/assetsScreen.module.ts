import { IdentificationDescriptionModalComponent } from './cardAsset/cardAssetTabs/problem-identification/identification-description-modal/identification-description-modal.component';
import { FilterProblemsComponent } from './cardAsset/cardAssetTabs/problem-identification/filter-Problems/filter-Problems.component';
import { ProblemIdentificationComponent } from './cardAsset/cardAssetTabs/problem-identification/problem-identification.component';
import { ViewDataFilterModule } from './../../shared/components/view-data-filter/view-data-filter.module';
import { CalenderFeildModule } from './../../shared/components/calender-feild/calender-feild/calender-feild.module';
import { ViewItemInFieldModule } from 'src/app/shared/components/ViewFieldInItem/view-field-in-item.Module';
import { GoogleMapModule } from './../../shared/components/google-map/google-map.module';
import { IconFieldModule } from './../../shared/components/icon-field/icon-field.module';
import { FieldDynamicModule } from './../../shared/components/FieldDynamic/fieldDynamic.module';
import { TreeModule } from 'primeng/tree';
import { TranslateModule } from '@ngx-translate/core';
import { ActionOfAssetSelectedComponent } from './ActionOfAssetSelected/action-of-asset-selected.component';
import { movementHistoryComponent } from './cardAsset/cardAssetTabs/movementHistory/movementHistory.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { HistoryFieldComponent } from './cardAsset/cardAssetModals/HistoryField/HistoryField.Component';
import { subAssetsComponent } from './cardAsset/cardAssetTabs/subAssets/subAssets.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SharedModule } from '../../shared/Shared.module';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { assetsScreenComponent } from './assetsScreen.component';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { TabViewModule } from 'primeng/tabview';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FileUploadModule } from 'primeng/fileupload';
import { HttpClientModule } from '@angular/common/http';
import { addAssetsComponent } from './addAssets/addAssets.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { ActionsFilterComponent } from './cardAsset/cardAssetModals/ActionsFilter/ActionsFilter.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ArchiveValuesComponent } from './cardAsset/cardAssetModals/ArchiveValues/ArchiveValues.component';
import { AddChildComponent } from './cardAsset/cardAssetModals/AddChild/AddChild.component';
import { basicInformationComponent } from './cardAsset/cardAssetTabs/basicInformation/basicInformation.component';
import { suppliersComponent } from './cardAsset/cardAssetTabs/supplier/suppliers.component';
import { sparePartsComponent } from './cardAsset/cardAssetTabs/spareParts/spareParts.component';
import { protectiveTasksComponent } from './cardAsset/cardAssetTabs/protectiveTasks/protectiveTasks.component';
import { settingAssetsComponent } from './cardAsset/cardAssetTabs/settingAssets/settingAssets.component';
import { depreciationComponent } from './cardAsset/cardAssetTabs/depreciation/depreciation.component';
import { QRCodeComponent } from './cardAsset/cardAssetTabs/QRCode/QRCode.component';
import { cardAssetsModalComponent } from './cardAsset/cardAssetByModal/cardAssetModal.component';
import { cardAssetLinkComponent } from './cardAsset/cardAssetByLink/cardAssetLink.component';
import { QRCodeModule } from 'angularx-qrcode';
import { ChartModule } from 'primeng/chart';
import { CardImageComponent } from './cardAsset/cardAssetModals/card-image/card-image.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AddImageAssetComponent } from './addAssets/add-image-asset/add-image-asset.component';
import { MoveSelectedComponent } from './ActionOfAssetSelected/move-selected/move-selected.component';
import { DeleteSelectedComponent } from './ActionOfAssetSelected/delete-selected/delete-selected.component';
import { FilterAssetsComponent } from './filter-assets/filter-assets.component';
import { MatTreeModule } from '@angular/material/tree';
import { TableAssetsComponent } from './table-assets/ViewAsTable/table-assets.component';
import { TreeSingleSelectionModule } from 'src/app/shared/components/Tree/tree-single-selection/tree.module';
import { TreeAssetsModule } from 'src/app/shared/components/Tree/tree-assets/tree-assets.module';
import { ApiComponent } from './cardAsset/cardAssetTabs/api/api.component';
import { AddActionModule } from 'src/app/shared/components/AddAction/add-action.module';
import { ReportsComponent } from './cardAsset/cardAssetTabs/reports/reports.component';
import { RuqestForginServiceOrSparePartModule } from 'src/app/shared/components/ruqest-forgin-service-or-spare-part/ruqest-forgin-service-or-spare-part.module';
import { LinkAssetWithVendorComponent } from './cardAsset/cardAssetModals/link-asset-with-vendor/link-asset-with-vendor.component';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { DisplayAsMapComponent } from './table-assets/display-as-map/display-as-map.component';
import { GMapModule } from 'primeng/gmap';
import { SplitButtonModule } from 'primeng/splitbutton';
import { BlockUIModule } from 'primeng/blockui';
import { NgxPrintModule } from 'ngx-print';
import { SkeletonModule } from 'primeng/skeleton';
import { ViewAsTreeModule } from './table-assets/view-as-tree/view-as-tree.module';
import { LogsByComponentTypeModule } from 'src/app/shared/components/logs-by-component-type/logs-by-component-type.module';
import { Tree } from 'primeng/tree';
import { ViewDataFilterComponent } from 'src/app/shared/components/view-data-filter/view-data-filter.component';
import { confirmDeleteComponent } from 'src/app/shared/confirmDelete/confirmDelete.component';
import { TreeAssetsLocationModule } from 'src/app/shared/components/Tree/tree-assets copy/tree-assets.module';

@NgModule({
  declarations: [
    assetsScreenComponent,
    addAssetsComponent,
    // cards
    cardAssetsModalComponent,
    cardAssetLinkComponent,
    //modal in card
    ArchiveValuesComponent,
    ActionsFilterComponent,
    AddChildComponent,
    HistoryFieldComponent,
    //Tab in Card
    basicInformationComponent,
    suppliersComponent,
    sparePartsComponent,
    protectiveTasksComponent,
    movementHistoryComponent,
    ReportsComponent,
    subAssetsComponent,
    settingAssetsComponent,
    depreciationComponent,
    QRCodeComponent,
    CardImageComponent,
    AddImageAssetComponent,
    MoveSelectedComponent,
    DeleteSelectedComponent,
    FilterAssetsComponent,
    ActionOfAssetSelectedComponent,
    TableAssetsComponent,
    ApiComponent,
    LinkAssetWithVendorComponent,
    DisplayAsMapComponent,
    ProblemIdentificationComponent,
    FilterProblemsComponent,
    IdentificationDescriptionModalComponent,
  ],
  imports: [
    RouterModule.forChild([
      {
        path: 'Asset-main',
        component: assetsScreenComponent,
      },
      {
        path: 'card/:id',
        component: cardAssetLinkComponent,
      },
    ]),
    CommonModule,
    DialogModule,
    DropdownModule,
    CalendarModule,
    TabViewModule,
    InputSwitchModule,
    FileUploadModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    TooltipModule,
    SharedModule,
    ProgressSpinnerModule,
    Ng2SearchPipeModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    DragDropModule,
    QRCodeModule,
    ChartModule,
    ImageCropperModule,
    MatButtonModule,
    MatIconModule,
    MatTreeModule,
    TranslateModule.forChild(),
    TreeModule,
    FieldDynamicModule,
    IconFieldModule,
    GoogleMapModule,
    TreeSingleSelectionModule,
    TreeAssetsModule,
    AddActionModule,
    ViewItemInFieldModule,
    RuqestForginServiceOrSparePartModule,
    AvatarModule,
    BadgeModule,
    GMapModule,
    GoogleMapModule,
    SplitButtonModule,
    BlockUIModule,
    NgxPrintModule,
    SkeletonModule,
    ViewAsTreeModule,
    LogsByComponentTypeModule,
    CalenderFeildModule,
    ViewDataFilterModule,
    TreeAssetsLocationModule,
  ],
  exports: [
    assetsScreenComponent,
    addAssetsComponent,
    // cards
    cardAssetsModalComponent,
    cardAssetLinkComponent,
    //modal in card
    ArchiveValuesComponent,
    ActionsFilterComponent,
    AddChildComponent,
    HistoryFieldComponent,
    //Tab in Card
    basicInformationComponent,
    suppliersComponent,
    sparePartsComponent,
    protectiveTasksComponent,
    movementHistoryComponent,
    ReportsComponent,
    subAssetsComponent,
    settingAssetsComponent,
    depreciationComponent,
    QRCodeComponent,
    CardImageComponent,
    AddImageAssetComponent,
    MoveSelectedComponent,
    DeleteSelectedComponent,
    FilterAssetsComponent,
    ActionOfAssetSelectedComponent,
    TableAssetsComponent,
    ApiComponent,
    LinkAssetWithVendorComponent,
    DisplayAsMapComponent,
    confirmDeleteComponent,
    FilterProblemsComponent,
    IdentificationDescriptionModalComponent,
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
})
export class assetsScreenModule {}
