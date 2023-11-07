import { ImageCutModule } from './../../shared/components/image-cut/image-cut.module';
import { MultiSelectModule } from 'primeng/multiselect';
import { TooltipModule } from 'primeng/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FieldDynamicModule } from './../../shared/components/FieldDynamic/fieldDynamic.module';
import { RouterModule } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ViewOldRequestComponent } from './view-old-request/view-old-request.component';
import { ApplyComponent } from './apply/apply.component';
import { MaintenanceRequestComponent } from './maintenance-request.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeAssetsModule } from 'src/app/shared/components/Tree/tree-assets/tree-assets.module';
import { ViewItemInFieldModule } from 'src/app/shared/components/ViewFieldInItem/view-field-in-item.Module';
import { CaptchaModule } from 'primeng/captcha';

@NgModule({
  declarations: [
    MaintenanceRequestComponent,
    ApplyComponent,
    ViewOldRequestComponent,
  ],
  imports: [
    RouterModule.forChild([
      {
        path: ':id',
        component: MaintenanceRequestComponent,
      },
      {
        path: ':id/:AssetID',
        component: MaintenanceRequestComponent,
      },
    ]),
    CommonModule,
    DropdownModule,
    MatDialogModule,
    FieldDynamicModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    TooltipModule,
    MultiSelectModule,
    ImageCutModule,
    ViewItemInFieldModule,
    TreeAssetsModule,
    CaptchaModule,
  ],
})
export class MaintenanceRequestModule {}
