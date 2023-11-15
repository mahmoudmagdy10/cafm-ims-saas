import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { WidgetsModule } from '../../_metronic/partials';
import { GMapModule } from 'primeng/gmap';
import { WindowInfoComponent } from './window-info/window-info.component';
import { DashboardFilter } from './filter/dashboard-filter.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { DropdownModule } from 'primeng/dropdown';
import { ChartModule } from 'primeng/chart';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ImageModule } from 'primeng/image';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { LastDashboardComponent } from './last-dashboard/last-dashboard.component';
@NgModule({
  declarations: [DashboardComponent, WindowInfoComponent, DashboardFilter, LastDashboardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: LastDashboardComponent,
      },
    ]),
    WidgetsModule,
    TranslateModule.forChild(),
    GMapModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    DropdownModule,
    ChartModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    ImageModule,
    AvatarModule,
    BadgeModule,
  ],
})
export class DashboardModule {}
