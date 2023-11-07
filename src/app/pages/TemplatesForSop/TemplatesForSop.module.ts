import { SopTemplateCard } from './modals/SopTemplateCard/SopTemplateCard.component';
import { SharedModule } from 'src/app/shared/Shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialogModule } from '@angular/material/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { TabViewModule } from 'primeng/tabview';
import { MultiSelectModule } from 'primeng/multiselect';
import { TooltipModule } from 'primeng/tooltip';
import { TreeModule } from 'primeng/tree';
import { FieldDynamicModule } from 'src/app/shared/components/FieldDynamic/fieldDynamic.module';
import { FileUploadModule } from 'primeng/fileupload';
import { QRCodeModule } from 'angularx-qrcode';
import {  ViewTableForTemplateSOPComponent } from './viewType/view-table/view-table.component';
import { FullCalendarModule } from '@fullcalendar/angular'; //
import { ChipModule } from 'primeng/chip';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { TreeSingleSelectionModule } from 'src/app/shared/components/Tree/tree-single-selection/tree.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ViewDataFilterModule } from 'src/app/shared/components/view-data-filter/view-data-filter.module';
import { PaginationComponentModule } from 'src/app/shared/components/pagination-component/pagination-component.module';
import { addSopTemplate } from './modals/addSopTemplate/addSopTemplate.component';
import { TemplatesForSopComponent } from './TemplatesForSop.component';
import { SopTemplateLinkComponent } from './modals/SopTemplateCard/SopTemplate-link/SopTemplate-link.component';
import { IconFieldModule } from 'src/app/shared/components/icon-field/icon-field.module';
import { EditInstructionToSopTemplateComponent } from './modals/SopTemplateCard/SopTemplateCardTabs/edit-instruction/editInstruction.component';
import { CreateTaskForTemplateSop } from './modals/create-task/create-task.component';
import { TemplatesForSopFilter } from './modals/filter/pm-filter.component';
import { SparePartInSopTemplateComponent } from './modals/SopTemplateCard/SopTemplateCardTabs/spare-part-in-Template-SOP/spare-part-in-Template-SOP.component';
import { FieldsAsAssetIdToTemplateComponent } from './modals/SopTemplateCard/SopTemplateCardTabs/edit-instruction/fields-as-asset-id/fields-as-asset-id.component';
import { AddInstructionToTemplateComponent } from './modals/SopTemplateCard/SopTemplateCardTabs/edit-instruction/add-instruction/addInstruction.component';
import { BasicDataSopTemplateComponent } from './modals/SopTemplateCard/SopTemplateCardTabs/basic-data/basic-data.component';

@NgModule({
  declarations: [
    TemplatesForSopComponent,
    addSopTemplate,
    SopTemplateCard,
    CreateTaskForTemplateSop,
    ViewTableForTemplateSOPComponent,
    EditInstructionToSopTemplateComponent,
    TemplatesForSopFilter,
    SparePartInSopTemplateComponent,
    FieldsAsAssetIdToTemplateComponent,
    AddInstructionToTemplateComponent,
    SopTemplateLinkComponent,
    BasicDataSopTemplateComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: TemplatesForSopComponent,
      },
      {
        path: ':id',
        component: SopTemplateLinkComponent,
      },
    ]),
    TranslateModule.forChild(),
    MatDialogModule,
    DropdownModule,
    MatDatepickerModule,
    MatNativeDateModule,
    TabViewModule,
    MultiSelectModule,
    TooltipModule,
    ReactiveFormsModule,
    IconFieldModule,
    TreeModule,
    FieldDynamicModule,
    FileUploadModule,
    FormsModule,
    SharedModule,
    QRCodeModule,
    FullCalendarModule,
    ChipModule,
    AvatarModule,
    BadgeModule,
    TreeSingleSelectionModule,
    MatAutocompleteModule,
    ViewDataFilterModule,
    PaginationComponentModule,
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
})
export class SOPTemplateModule {}
