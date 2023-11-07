import { ViewDataFilterModule } from './../../../shared/components/view-data-filter/view-data-filter.module';
import { CalenderFeildModule } from './../../../shared/components/calender-feild/calender-feild/calender-feild.module';
import { PaginationComponentModule } from './../../../shared/components/pagination-component/pagination-component.module';
import { AdministratorFilterLogsComponent } from './administrator-logs/administrator-filter-logs/administrator-filter-logs.component';
import { BadgeModule } from 'primeng/badge';
import { AdministratorLogsComponent } from './administrator-logs/administrator-logs.component';
import { SharedModule } from 'src/app/shared/Shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { DataSubscriptionComponent } from './DataSubscription/DataSubscription.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { administratorComponent } from './administrator.component';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { addModuleComponent } from './addModule/addModule.component';
import { MatTabsModule } from '@angular/material/tabs';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FilterModuleComponent } from './FilterModule/FilterModule.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { DataCompanyComponent } from './DataCompany/DataCompany.component';
import { SendEmailModuleComponent } from './SendEmailModule/SendEmailModule.component';
import { SubscriptionrenewalComponent } from './Subscriptionrenewal/Subscriptionrenewal.component';
import { DialogModule } from 'primeng/dialog';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { ActivisionModuleComponent } from './ActivisionModule/ActivisionModule.component';
import { DropdownModule } from 'primeng/dropdown';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { modal4Component } from './changePass/modal4.component';
import { TemplateForBackup } from './TemplateForBackup/TemplateForBackup.component';
import { TemplateForBackupForCompany } from './TemplateForBackupForCompany/TemplateForBackupForCompany.component';
import { WidgetsModule } from 'src/app/_metronic/partials';
@NgModule({
  declarations: [
    administratorComponent,
    addModuleComponent,
    FilterModuleComponent,
    ActivisionModuleComponent,
    DataCompanyComponent,
    DataSubscriptionComponent,
    SendEmailModuleComponent,
    SubscriptionrenewalComponent,
    modal4Component,
    TemplateForBackup,
    TemplateForBackupForCompany,
    AdministratorLogsComponent,
    AdministratorFilterLogsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: administratorComponent,
      },
      {
        path: ':CompanyId',
        component: AdministratorLogsComponent,
      },
    ]),
    WidgetsModule,
    MatCardModule,
    MatTooltipModule,
    MatDialogModule,
    MatTabsModule,
    MatCheckboxModule,
    MultiSelectModule,
    // EditorModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    MatProgressSpinnerModule,
    CKEditorModule,
    DropdownModule,
    TranslateModule,
    SharedModule,
    BadgeModule,
    PaginationComponentModule,
    CalenderFeildModule,
    ViewDataFilterModule,
  ],
})
export class administratorModule {}
