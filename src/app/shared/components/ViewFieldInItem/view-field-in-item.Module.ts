import { ImageModule } from 'primeng/image';
import { TooltipModule } from 'primeng/tooltip';
import { IconFieldModule } from 'src/app/shared/components/icon-field/icon-field.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddFieldToItemComponent } from './AddFieldToItem/add-field-to-item.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldDynamicModule } from '../FieldDynamic/fieldDynamic.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ViewFieldInItemComponent } from './view-field-in-item.component';
import { SharedModule } from '../../Shared.module';
import { HistoryFieldComponent } from './HistoryField/HistoryField.Component';
import { ChartModule } from 'primeng/chart';
import { TabViewModule } from 'primeng/tabview';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ViewFilesOrImageModule } from './view-files-or-image/view-files-or-image.module';

@NgModule({
  declarations: [
    AddFieldToItemComponent,
    ViewFieldInItemComponent,
    HistoryFieldComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    FieldDynamicModule,
    IconFieldModule,
    Ng2SearchPipeModule,
    SharedModule,
    TooltipModule,
    ChartModule,
    TabViewModule,
    ProgressSpinnerModule,
    ImageModule,
    ViewFilesOrImageModule
  ],
  exports: [ViewFieldInItemComponent],
})
export class ViewItemInFieldModule {}
