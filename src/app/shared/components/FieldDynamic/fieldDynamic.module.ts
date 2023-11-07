import { ImageModule } from 'primeng/image';
import { FileUploadModule } from 'primeng/fileupload';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { fieldDynamicComponent } from './fieldDynamic.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FieldRequestApproveComponent } from './field-request-approve/field-request-approve.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule} from '@angular/material/tooltip';
import { TooltipModule } from 'primeng/tooltip';
import { AssetsFieldComponent } from './assets-field/assets-field.component';
import { TreeAssetsModule } from '../Tree/tree-assets/tree-assets.module';

@NgModule({
  declarations: [fieldDynamicComponent,FieldRequestApproveComponent, AssetsFieldComponent],
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    FileUploadModule,
    MatDialogModule,
    MatTooltipModule,
    TooltipModule,
    TranslateModule.forChild(),
    ImageModule,
    TreeAssetsModule
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  exports:[fieldDynamicComponent]
})
export class FieldDynamicModule {}
