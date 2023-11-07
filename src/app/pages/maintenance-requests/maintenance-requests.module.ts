import { IconFieldModule } from './../../shared/components/icon-field/icon-field.module';
import { FieldDynamicModule } from './../../shared/components/FieldDynamic/fieldDynamic.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { QRCodeModule } from 'angularx-qrcode';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SharedModule } from '../../shared/Shared.module';
import { FileUploadModule } from 'primeng/fileupload';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { AddFieldComponentInWorkRequests } from './edit-maintenance-requests/edit-Modals/AddField/AddField.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { EditMaintenanceRequestsComponent } from './edit-maintenance-requests/edit-maintenance-requests.component';
import { MatDialogModule } from '@angular/material/dialog';
import { TabViewModule } from 'primeng/tabview';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaintenanceRequestsComponent } from './maintenance-requests.component';
import { QrCodeComponent } from './qr-code/qr-code.component';
import { CopySettingComponent } from './copy-setting/copy-setting.component';
import { DropdownModule } from 'primeng/dropdown';
import { GateDesignComponent } from './edit-maintenance-requests/editTabs/gate-design/gate-design.component';
import { MaintenanceRequestSettingsComponent } from './edit-maintenance-requests/editTabs/maintenance-request-settings/maintenance-request-settings.component';
import { AdditionalFieldsComponent } from './edit-maintenance-requests/editTabs/additional-fields/additional-fields.component';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { TooltipModule } from 'primeng/tooltip';
import { AddImageworkRequestComponent } from './edit-maintenance-requests/editTabs/gate-design/add-image-workRequest/add-image-workRequest.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ViewItemInFieldModule } from 'src/app/shared/components/ViewFieldInItem/view-field-in-item.Module';

@NgModule({
  declarations: [
    MaintenanceRequestsComponent,
    QrCodeComponent,
    CopySettingComponent,
    EditMaintenanceRequestsComponent,
    GateDesignComponent,
    MaintenanceRequestSettingsComponent,
    AdditionalFieldsComponent,

    AddFieldComponentInWorkRequests,
    AddImageworkRequestComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: MaintenanceRequestsComponent,
      },
    ]),
    TabViewModule,
    DropdownModule,
    MatDatepickerModule,
    MatDialogModule,
    TranslateModule.forChild(),
    FormsModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule,
    FileUploadModule,
    SharedModule,
    ProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    QRCodeModule,
    DragDropModule,
    FieldDynamicModule,
    IconFieldModule,
    TooltipModule,
    ImageCropperModule,
    ViewItemInFieldModule
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
})
export class MaintenanceRequestsModule {}
