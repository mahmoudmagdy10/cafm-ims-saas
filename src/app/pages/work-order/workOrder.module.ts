import { PMsModule } from './../pms/pms.module';
import { CalenderFeildModule } from './../../shared/components/calender-feild/calender-feild/calender-feild.module';
import { CalenderFeildComponent } from './../../shared/components/calender-feild/calender-feild/calender-feild.component';
import { TCComponent } from './modals/task-card/modalsCard/TC/TC.component';
import { AddNewTaskByLinkComponent } from './modals/add-new-task-link/add-new-task-link.component';
import { FileUploadModule } from 'primeng/fileupload';
import { EditInstructionComponent } from './modals/task-card/modalsCard/edit-instruction/editInstruction.component';
import { SharedModule } from '../../shared/Shared.module';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AddNewTaskComponent } from './modals/add-new-task/add-new-task.component';
import { TimeConsumingComponent } from './modals/task-card/modalsCard/time-consuming/time-consuming.component';
import { TaskCardComponent } from './modals/task-card/task-card.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { DropdownModule } from 'primeng/dropdown';
import { TooltipModule } from 'primeng/tooltip';
import { TabViewModule } from 'primeng/tabview';
import { MultiSelectModule } from 'primeng/multiselect';
import { TranslateModule } from '@ngx-translate/core';
import { FilterComponent } from './modals/filter/filter.component';
import { AddInstructionComponent } from './modals/task-card/modalsCard/edit-instruction/add-instruction/addInstruction.component';
import { ChooseTemplateComponent } from './modals/choose-template/chooseTemplate.component';
import { AccordingToUsersComponent } from './ViewTypes/according-to-users/according-to-users.component';
import { ListComponent } from './ViewTypes/list/list.component';
import { FullCalenderComponent } from './ViewTypes/full-calender/full-calender.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TreeAssetsModule } from 'src/app/shared/components/Tree/tree-assets/tree-assets.module';
import { InformtionBasicComponent } from './modals/task-card/TabsCard/informtion-basic/informtion-basic.component';
import { InstructionsComponent } from './modals/task-card/TabsCard/instructions/instructions.component';
import { MovementRecordComponent } from './modals/task-card/TabsCard/movement-record/movement-record.component';
import { MaintenanceTimeComponent } from './modals/task-card/TabsCard/maintenance-time/maintenance-time.component';
import { InformtionRowComponent } from './modals/task-card/informtion-row/informtion-row.component';
import { ChangePriortyComponent } from './actionsOfWorkOrderSelected/change-priorty/change-priorty.component';
import { ChangeStatusComponent } from './actionsOfWorkOrderSelected/change-status/change-status.component';
import { ChangeDueDateComponent } from './actionsOfWorkOrderSelected/change-due-date/change-due-date.component';
import { TableShowSelectedComponent } from './actionsOfWorkOrderSelected/table-show-selected/table-show-selected.component';
import { DeleteTasksComponent } from './actionsOfWorkOrderSelected/delete-tasks/delete-tasks.component';
import { ActionsOfWorkOrderSelectedComponent } from './actionsOfWorkOrderSelected/actions-of-work-order-selected/actions-of-work-order-selected.component';
import { ChartFirstPipe } from './pipes/chart-first.pipe';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TransformTimePipe } from './pipes/transform-time.pipe';
import { IconFieldModule } from 'src/app/shared/components/icon-field/icon-field.module';
import { TemplatesManagementComponent } from './modals/templates-management/templateManagement.component';
import { TreeModule } from 'primeng/tree';
import { FieldDynamicModule } from 'src/app/shared/components/FieldDynamic/fieldDynamic.module';
import { FieldsAsAssetIdComponent } from './modals/task-card/modalsCard/edit-instruction/fields-as-asset-id/fields-as-asset-id.component';
import { OptionInstrSelrctPipe } from './modals/task-card/TabsCard/instructions/option-instr-selrct.pipe';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AddLogComponent } from './modals/task-card/modalsCard/add-log/add-log.component';
import { CompleteNewTask } from './modals/task-card/modalsCard/complete-new-task/complete-new-task.component';
import { ImageModule } from 'primeng/image';
import { ProgressBarModule } from 'primeng/progressbar';
import { workOrderComponent } from './workOrder.component';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { PurchaseOrderComponent } from './modals/task-card/TabsCard/purchase-order/purchase-order.component';
import { AddPurchaseOrderComponent } from './modals/task-card/modalsCard/add-purchase-order/add-purchase-order.component';
import { RuqestForginServiceOrSparePartModule } from 'src/app/shared/components/ruqest-forgin-service-or-spare-part/ruqest-forgin-service-or-spare-part.module';
import { SparePartInWorkOrderComponent } from './modals/task-card/TabsCard/spare-part-in-work-order/spare-part-in-work-order.component';
import { OpenByLinkComponent } from './modals/task-card/open-by-link/open-by-link.component';
import { QRCodeForWorkOrderComponent } from './modals/task-card/TabsCard/QRCode/QRCode.component';
import { QRCodeModule } from 'angularx-qrcode';
import { CalendarModule } from 'primeng/calendar';
import { PanelModule } from 'primeng/panel';
import { NgxPrintModule } from 'ngx-print';
import { SkeletonModule } from 'primeng/skeleton';
import { AccordionModule } from 'primeng/accordion';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { StatusTaskComponent } from './status-task/status-task.component';
import { TimeLineForUserGroupComponent } from './ViewTypes/time-line-for-user-group/time-line-for-user-group.component';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import { TimeLineForTasksComponent } from './ViewTypes/time-line-for-tasks/time-line-for-tasks.component';
import { ApplyComponent } from './apply/apply.component';
import { ConfirmChangeStatusComponent } from './modals/task-card/TabsCard/instructions/confirm-change-status/confirm-change-status.component';
import { TooltipForTaskPipe } from './pipes/tooltip-for-task.pipe';
import { RateLatePipe } from './pipes/rate-late.pipe';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { EditorModule } from 'primeng/editor';
import { TabMenuModule } from 'primeng/tabmenu';
import { SplitButtonModule } from 'primeng/splitbutton';
import { DefualtTemplateComponent } from './modals/task-card/templates/defualt-template/defualt-template.component';
import { VerticalTemplateComponent } from './modals/task-card/templates/vertical-template/vertical-template.component';
import { ChangeToPendingComponent } from './change-to-pending/change-to-pending.component';
import { ResonWithStatusComponent } from './modals/task-card/reson-with-status/reson-with-status.component';
import { HistoryForUsersWorkOnTaskComponent } from './modals/history-for-users-work-on-task/history-for-users-work-on-task.component';
import { GoogleMapModule } from 'src/app/shared/components/google-map/google-map.module';
import { ViewFilesOrImageModule } from 'src/app/shared/components/ViewFieldInItem/view-files-or-image/view-files-or-image.module';
import { HistoryForUsersWorkOnTaskFilesComponent } from './modals/history-for-users-work-on-task/history-for-users-work-on-task-files/history-for-users-work-on-task-files.component';
import { StoresModule } from '../stores/spare-parts.module';
import { PrintReportComponent } from './modals/print-report/print-report.component';
import { PreviewMultiImageModule } from 'src/app/shared/components/preview-multi-image/preview-multi-image.module';
import { ApplyCompleteComponent } from './modals/task-card/modalsCard/apply-complete/apply-complete.component';
import { PaginationComponentModule } from 'src/app/shared/components/pagination-component/pagination-component.module';
import { ReportWorkOrderPdfComponent } from './report-work-order-pdf/report-work-order-pdf.component';
import { ContextMenuModule } from 'primeng/contextmenu';
import { FilterForPrintPdfComponent } from './modals/filter-for-print-pdf/filter-for-print-pdf.component';
import { DailyWoComponent } from './ViewTypes/according-to-created-date/according-to-created-date.component';
import { SparePartInWorkOrderTransfarListComponent } from './modals/task-card/TabsCard/spare-part-in-work-order/spare-part-in-work-order-transfar-list/spare-part-in-work-order-transfar-list.component';
import { LogsByComponentTypeModule } from 'src/app/shared/components/logs-by-component-type/logs-by-component-type.module';
import { SidebarModule } from 'primeng/sidebar';
import { PrintSelectedComponent } from './actionsOfWorkOrderSelected/print-selected/print-selected.component';
import { WeeklyPrintWorkOrderComponent } from './modals/Weekly-print-work-order/Weekly-print-work-order.component';
import {BlockUIModule} from 'primeng/blockui';
import { WorkorderCostComponent } from './modals/task-card/TabsCard/workorder-cost/workorder-cost.component';
import { ExtraFieldsComponent } from './modals/task-card/extra-fields/extra-fields.component';

@NgModule({
  declarations: [
    workOrderComponent,
    AddNewTaskComponent,
    TimeConsumingComponent,
    TaskCardComponent,
    FilterComponent,
    EditInstructionComponent,
    AddInstructionComponent,
    ChooseTemplateComponent,
    TemplatesManagementComponent,
    AccordingToUsersComponent,
    ListComponent,
    FullCalenderComponent,
    InformtionBasicComponent,
    InstructionsComponent,
    MovementRecordComponent,
    MaintenanceTimeComponent,
    InformtionRowComponent,
    ChangePriortyComponent,
    ChangeStatusComponent,
    ChangeDueDateComponent,
    TableShowSelectedComponent,
    DeleteTasksComponent,
    ActionsOfWorkOrderSelectedComponent,
    ChartFirstPipe,
    TransformTimePipe,
    FieldsAsAssetIdComponent,
    OptionInstrSelrctPipe,
    AddLogComponent,
    CompleteNewTask,
    PurchaseOrderComponent,
    AddPurchaseOrderComponent,
    SparePartInWorkOrderComponent,
    OpenByLinkComponent,
    QRCodeForWorkOrderComponent,
    StatusTaskComponent,
    TimeLineForUserGroupComponent,
    TimeLineForTasksComponent,
    ApplyComponent,
    ConfirmChangeStatusComponent,
    TooltipForTaskPipe,
    RateLatePipe,
    AddNewTaskByLinkComponent,
    DefualtTemplateComponent,
    VerticalTemplateComponent,
    ChangeToPendingComponent,
    ResonWithStatusComponent,
    HistoryForUsersWorkOnTaskComponent,
    HistoryForUsersWorkOnTaskFilesComponent,
    TCComponent,
    PrintReportComponent,
    ApplyCompleteComponent,
    ReportWorkOrderPdfComponent,
    FilterForPrintPdfComponent,
    DailyWoComponent,
    SparePartInWorkOrderTransfarListComponent,
    PrintSelectedComponent,
    WeeklyPrintWorkOrderComponent,
    WorkorderCostComponent,
    ExtraFieldsComponent,
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatDatepickerModule,
    DropdownModule,
    MatNativeDateModule,
    TooltipModule,
    TabViewModule,
    MultiSelectModule,
    TranslateModule.forChild(),
    FullCalendarModule,
    ReactiveFormsModule,
    TreeAssetsModule,
    SharedModule,
    FormsModule,
    InputSwitchModule,
    IconFieldModule,
    TreeModule,
    FieldDynamicModule,
    FileUploadModule,
    MatTooltipModule,
    ImageModule,
    ProgressBarModule,
    ToggleButtonModule,
    RuqestForginServiceOrSparePartModule,
    SidebarModule,
    CalenderFeildModule,
    RouterModule.forChild([
      {
        path: 'workOrderNotCompleted',
        data: { workOrderCompleted: false },
        component: workOrderComponent,
      },
      {
        path: 'workOrderCompleted',
        data: { workOrderCompleted: true },

        component: workOrderComponent,
      },
      {
        path: 'card/:id',
        component: OpenByLinkComponent,
      },
      {
        path: 'addTask',
        component: AddNewTaskByLinkComponent,
      },
    ]),
    QRCodeModule,
    CalendarModule,
    MenuModule,
    PanelModule,
    NgxPrintModule,
    SkeletonModule,
    AccordionModule,
    ButtonModule,
    AvatarModule,
    BadgeModule,
    EditorModule,
    TabMenuModule,
    SplitButtonModule,
    GoogleMapModule,
    ViewFilesOrImageModule,
    StoresModule,
    PreviewMultiImageModule,
    PaginationComponentModule,
    ContextMenuModule,
    LogsByComponentTypeModule,
    PMsModule,BlockUIModule
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
})
export class workOrderModule {}
