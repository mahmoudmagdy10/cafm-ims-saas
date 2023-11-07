import { BalancedRedistributionDialogComponent } from './modals/balanced-redistribution-dialog/balanced-redistribution-dialog.component';
import { DailyWoComponent } from './../work-order/ViewTypes/according-to-created-date/according-to-created-date.component';
import { SharedModule } from 'src/app/shared/Shared.module';
import { FieldsAsAssetIdToPmsComponent } from './modals/pm-card/pmCardTabs/edit-instruction/fields-as-asset-id/fields-as-asset-id.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PMcard } from './modals/pm-card/pm-card.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PmsComponent } from './pms.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { schedules } from './modals/schedules/schedules.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { addPMTask } from './modals/addPMTask/addPMTask.component';
import { TabViewModule } from 'primeng/tabview';
import { MultiSelectModule } from 'primeng/multiselect';
import { PMFilter } from './modals/filter/pm-filter.component';
import { TooltipModule } from 'primeng/tooltip';
import { CreateTask } from './modals/create-task/create-task.component';
import { BasicDataComponent } from './modals/pm-card/pmCardTabs/basic-data/basic-data.component';
import { SchedulingComponent } from './modals/pm-card/pmCardTabs/scheduling/scheduling.component';
import { UpComingTimeComponent } from './modals/pm-card/pmCardTabs/up-coming-time/up-coming-time.component';
import { QrCodeComponent } from './modals/pm-card/pmCardTabs/qr-code/qr-code.component';
import { EditInstructionToPmsComponent } from './modals/pm-card/pmCardTabs/edit-instruction/editInstruction.component';
import { IconFieldModule } from 'src/app/shared/components/icon-field/icon-field.module';
import { TreeModule } from 'primeng/tree';
import { FieldDynamicModule } from 'src/app/shared/components/FieldDynamic/fieldDynamic.module';
import { FileUploadModule } from 'primeng/fileupload';
import { AddInstructionToPmsComponent } from './modals/pm-card/pmCardTabs/edit-instruction/add-instruction/addInstruction.component';
import { QRCodeModule } from 'angularx-qrcode';
import { ViewTableComponent } from './viewType/view-table/view-table.component';
import { ViewCalenderComponent } from './viewType/view-calender/view-calender.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { PmCardLinkComponent } from './modals/pm-card/pm-card-link/pm-card-link.component';
import { ChipModule } from 'primeng/chip';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { TreeSingleSelectionModule } from 'src/app/shared/components/Tree/tree-single-selection/tree.module';
import { SparePartInPreventiveComponent } from './modals/pm-card/pmCardTabs/spare-part-in-preventive/spare-part-in-preventive.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ViewDataFilterModule } from 'src/app/shared/components/view-data-filter/view-data-filter.module';
import { PaginationComponentModule } from 'src/app/shared/components/pagination-component/pagination-component.module';
import { PrintPPMReportComponent } from './modals/print-report/print-report.component';
import { CalendarModule } from 'primeng/calendar';
import { DailyWoPmsComponent } from './viewType/according-to-created-date-pms/according-to-created-date-pms.component';
import { NgxPrintModule } from 'ngx-print';
import { ImageModule } from 'primeng/image';
import { WeeklyPrintComponent } from './modals/Weekly-print/Weekly-print.component';
import { CalenderFeildModule } from 'src/app/shared/components/calender-feild/calender-feild/calender-feild.module';
import { PMcardCopy } from './modals/pm-card-in-create/pm-card.component';
import { PmCardLinkComponentCopy } from './modals/pm-card-in-create/pm-card-link/pm-card-link.component';
import { BasicDataComponentCopy } from './modals/pm-card-in-create/pmCardTabs/basic-data/basic-data.component';
import { EditInstructionToPmsCopyComponent } from './modals/pm-card-in-create/pmCardTabs/edit-instruction/editInstruction.component';
import { AddInstructionToPmsCopyComponent } from './modals/pm-card-in-create/pmCardTabs/edit-instruction/add-instruction/addInstruction.component';
import { FieldsAsAssetIdToPmsCopyComponent } from './modals/pm-card-in-create/pmCardTabs/edit-instruction/fields-as-asset-id/fields-as-asset-id.component';
import { SchedulingCopyComponent } from './modals/pm-card-in-create/pmCardTabs/scheduling/scheduling.component';
import { SparePartInPreventiveCopyComponent } from './modals/pm-card-in-create/pmCardTabs/spare-part-in-preventive/spare-part-in-preventive.component';
import { QrCodeCopyComponent } from './modals/pm-card-in-create/pmCardTabs/qr-code/qr-code.component';
import { UpComingTimeCopyComponent } from './modals/pm-card-in-create/pmCardTabs/up-coming-time/up-coming-time.component';
import { SkeletonModule } from 'primeng/skeleton';

@NgModule({
  declarations: [
    PmsComponent,
    schedules,
    addPMTask,
    PMcard,
    PMcardCopy,
    PMFilter,
    CreateTask,
    BasicDataComponent,
    BasicDataComponentCopy,
    SchedulingComponent,
    SchedulingCopyComponent,
    UpComingTimeComponent,
    UpComingTimeCopyComponent,
    QrCodeComponent,
    QrCodeCopyComponent,
    EditInstructionToPmsComponent,
    EditInstructionToPmsCopyComponent,
    AddInstructionToPmsComponent,
    AddInstructionToPmsCopyComponent,
    FieldsAsAssetIdToPmsComponent,
    FieldsAsAssetIdToPmsCopyComponent,
    ViewTableComponent,
    ViewCalenderComponent,
    PmCardLinkComponent,
    PmCardLinkComponentCopy,
    SparePartInPreventiveComponent,
    SparePartInPreventiveCopyComponent,
    PrintPPMReportComponent,
    DailyWoPmsComponent,
    WeeklyPrintComponent,
    BalancedRedistributionDialogComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: 'create-ppm',
        component: PmsComponent,
      },
      {
        path: 'link/:id',
        component: PmCardLinkComponent,
      },
      {
        path: 'CreateSoftServices',
        component: PmsComponent,
        data: { isSoftService: true },
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
    CalendarModule,
    TranslateModule,
    NgxPrintModule,
    ImageModule,
    CalenderFeildModule,
    SkeletonModule,
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  exports: [],
})
export class PMsModule {}
