import { cardAssetLinkComponent } from './../../assetsScreen/cardAsset/cardAssetByLink/cardAssetLink.component';
import { TreeSingleSelectionModule } from 'src/app/shared/components/Tree/tree-single-selection/tree.module';
import { TreeAssetsModule } from 'src/app/shared/components/Tree/tree-assets/tree-assets.module';
import { TreeModule } from 'primeng/tree';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/Shared.module';
import { modalchooesusersComponent } from './modalLocation/modalchooesusers/modalchooesusers.component';
import { modalAddLocation } from './modalLocation/modalAddLocation/modalAddLocation.component';
import { InlineSVGModule } from 'ng-inline-svg';
import { PrimeModule } from './../prime.module';
import { TooltipModule } from 'primeng/tooltip';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { locationsComponent } from './locations.component';
import { modalClickLocNameComponent } from './modalLocation/modalClickLocName/modalClickLocName.component';
import { modalDeleteComponent } from './modalLocation/modalDelete/modalDelete.component';
import { modalEmailComponent } from './modalLocation/modalEmail/modalEmail.component';
import { modalEditComponent } from './modalLocation/modalEdit/modalEdit.component';
import { DialogModule } from 'primeng/dialog';
import { modalThemesEmaillComponent } from './modalLocation/modalThemesEmail/modalThemesEmail.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { MultiSelectModule } from 'primeng/multiselect';
import { DataViewModule } from 'primeng/dataview';

import { CommonModule } from '@angular/common';
import { ImageCropperModule } from 'ngx-image-cropper';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FileUploadModule } from 'primeng/fileupload';
import { ImageModule } from 'primeng/image';
import { GoogleMapModule } from 'src/app/shared/components/google-map/google-map.module';
import { LocationReportSettingComponent } from './modalLocation/location-report-setting/location-report-setting.component';
import { assetsScreenModule } from '../../assetsScreen/assetsScreen.module';
import { PaginationComponentModule } from 'src/app/shared/components/pagination-component/pagination-component.module';
import { FilterLocationComponent } from './modalLocation/filter/filter.component';
import { ViewDataFilterModule } from 'src/app/shared/components/view-data-filter/view-data-filter.module';
import { ModalImgLocationComponent } from './modalLocation/modal-img-location/modal-img-location.component';
import { TabViewModule } from 'primeng/tabview';

@NgModule({
  declarations: [
    locationsComponent,
    modalAddLocation,
    modalClickLocNameComponent,
    modalchooesusersComponent,
    modalThemesEmaillComponent,
    modalDeleteComponent,
    modalEmailComponent,
    modalEditComponent,
    LocationReportSettingComponent,
    FilterLocationComponent,
    ModalImgLocationComponent,
  ],
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: locationsComponent,
      },
    ]),
    TooltipModule,
    InlineSVGModule,
    PrimeModule,
    CKEditorModule,
    DataViewModule,
    MultiSelectModule,
    SharedModule,
    CommonModule,
    DialogModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    ImageCropperModule,
    DropdownModule,
    ButtonModule,
    TranslateModule.forChild(),
    MatDialogModule,
    AvatarModule,
    BadgeModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FileUploadModule,
    ImageModule,
    FormsModule,
    GoogleMapModule,
    TreeModule,
    TreeAssetsModule,
    TreeSingleSelectionModule,
    assetsScreenModule,
    PaginationComponentModule,
    ViewDataFilterModule,
    TabViewModule,
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
})
export class locationsModule {
  display: boolean = false;

  showDialog() {
    this.display = true;
  }
}
