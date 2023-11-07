import { IconFieldModule } from './../../shared/components/icon-field/icon-field.module';
import { SharedModule } from '../../shared/Shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddReportComponent } from './modals/add-report/add-report.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccidentReportsComponent } from './accident-reports.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TooltipModule } from 'primeng/tooltip';
import { FilterIncidentReportComponent } from './modals/filter/filter.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { DropdownModule } from 'primeng/dropdown';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CalendarModule } from 'primeng/calendar';
import { FieldDynamicModule } from 'src/app/shared/components/FieldDynamic/fieldDynamic.module';
import { FieldManagmentModule } from 'src/app/shared/components/FieldManagment/FieldManagment.module';

@NgModule({
  declarations: [
    AccidentReportsComponent,
    FilterIncidentReportComponent,
    AddReportComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: AccidentReportsComponent,
      },
    ]),
    TranslateModule.forChild(),
    TooltipModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    DropdownModule,
    ReactiveFormsModule,
    SharedModule,
    IconFieldModule,
    Ng2SearchPipeModule,
    ProgressSpinnerModule,
    DragDropModule,
    CalendarModule,
    FieldDynamicModule,
    FormsModule,
    FieldManagmentModule
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
})
export class AccidentReportsModule {}
