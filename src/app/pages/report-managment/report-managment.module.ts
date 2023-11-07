import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { PaginationComponentModule } from './../../shared/components/pagination-component/pagination-component.module';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportManagmentComponent } from './report-managment.component';
import { ManageReportComponent } from './manage-report/manage-report.component';
import { FieldDynamicModule } from 'src/app/shared/components/FieldDynamic/fieldDynamic.module';
import { EventReportingClassificationComponent } from '../event-reporting-classification/event-reporting-classification/event-reporting-classification.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: ReportManagmentComponent },
      {
        path: 'event-clasification',
        component: EventReportingClassificationComponent,
      },
    ]),
    PaginationComponentModule,
    ProgressSpinnerModule,
    DropdownModule,
    TranslateModule,
    ReactiveFormsModule,
    MatDialogModule,
    FieldDynamicModule,
  ],
  declarations: [ReportManagmentComponent, ManageReportComponent],
})
export class ReportManagmentModule {}
