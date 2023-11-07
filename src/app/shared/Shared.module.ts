import { IsImagePipe } from './is-image.pipe';
import { IconFieldModule } from '../shared/components/icon-field/icon-field.module';

import { ReactiveFormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { CommonModule } from '@angular/common';
import { confirmDeleteComponent } from './confirmDelete/confirmDelete.component';
import { NgModule } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { modalsSharedComponent } from './modalsShared/modalsShared.component';
import { FieldShowInTableComponent } from './field-show-in-table/field-show-in-table.component';
import { TooltipModule } from 'primeng/tooltip';
import { UserAndTeamsModal } from './modalsShared/User&TeamsModal/User&TeamsModal.component';
import { NoDataComponent } from './no-data/no-data.component';
import { MinToHourPipe } from './min-to-hour.pipe';
import { ArrayToStringPipe } from './array-to-string.pipe';
import { ReversePipe } from './reverse.pipe';
import { ToFixedPipe } from './to-fixed.pipe';
import { CutLongStringPipe } from './cut-long-string.pipe';

@NgModule({
  declarations: [
    confirmDeleteComponent,
    modalsSharedComponent,
    // modal
    UserAndTeamsModal,
    FieldShowInTableComponent,
    NoDataComponent,
    IsImagePipe,
    MinToHourPipe,
    ArrayToStringPipe,
    ReversePipe,
    ToFixedPipe,
    CutLongStringPipe,
  ],
  imports: [
    DialogModule,
    CommonModule,
    TranslateModule.forChild(),
    Ng2SearchPipeModule,
    ReactiveFormsModule,
    IconFieldModule,
    TooltipModule,
  ],
  exports: [
    confirmDeleteComponent,
    modalsSharedComponent,
    FieldShowInTableComponent,
    NoDataComponent,
    IsImagePipe,
    MinToHourPipe,
    ArrayToStringPipe,
    ReversePipe,
    ToFixedPipe,
    CutLongStringPipe
  ],
})
export class SharedModule {}
