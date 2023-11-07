import { ReactiveFormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkerDashboardComponent } from './worker-dashboard.component';
import { TranslateModule } from '@ngx-translate/core';
import { DashboardFilter } from './filter/dashboard-filter.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
  declarations: [WorkerDashboardComponent, DashboardFilter],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: WorkerDashboardComponent,
      },
    ]),
    TranslateModule.forChild(),
    MatDatepickerModule,
    MatNativeDateModule,
    DropdownModule,
    MatDialogModule,
    ChartModule,
    ReactiveFormsModule,
  ],
})
export class WorkerDashboardModule {}
