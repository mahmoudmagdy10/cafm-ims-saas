import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventReportingComponent } from './event-reporting.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { EventReportFieldsComponent } from './Components/event-report-fields/event-report-fields.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ModalCloseReportComponent } from './Components/modal-close-report/modal-close-report.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { FilterReportsComponent } from './Components/filter-reports/filter-reports.component';
import { CloseCardHeaderComponent } from './Components/close-card-header/close-card-header.component';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  declarations: [
    EventReportingComponent,
    EventReportFieldsComponent,
    ModalCloseReportComponent,
    FilterReportsComponent,
    CloseCardHeaderComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: EventReportingComponent,
      },
    ]),
    TranslateModule.forChild(),
    MatDialogModule,
    ProgressSpinnerModule,
    DropdownModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    DialogModule,
    TooltipModule,
  ]
})
export class EventReportingModule { }
