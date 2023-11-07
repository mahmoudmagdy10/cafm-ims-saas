import { CalenderFeildModule } from './../../shared/components/calender-feild/calender-feild/calender-feild.module';
import { FilterDashboardComponent } from './filter-dashboard/filter-dashboard.component';
import { NewDashboardComponent } from './new-dashboard.component';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WidgetsModule } from '../../_metronic/partials';
import { GMapModule } from 'primeng/gmap';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { DropdownModule } from 'primeng/dropdown';
import { ChartModule } from 'primeng/chart';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ImageModule } from 'primeng/image';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { FormsModule } from '@angular/forms';
import { TabViewModule } from 'primeng/tabview';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PaginationComponentModule } from 'src/app/shared/components/pagination-component/pagination-component.module';
import { TableDashboardComponent } from './Table-dashboard/Table-dashboard.component';
import { CalendarModule } from 'primeng/calendar';
import { ViewDataFilterModule } from 'src/app/shared/components/view-data-filter/view-data-filter.module';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextModule } from 'primeng/inputtext';
import { SliderModule } from 'primeng/slider';
import { ProgressBarModule } from 'primeng/progressbar';
import { SkeletonModule } from 'primeng/skeleton';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SharedModule } from '../../shared/Shared.module';
import { SortablejsModule } from 'ngx-sortablejs';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: NewDashboardComponent,
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
    FormsModule,
    CalenderFeildModule,
    TabViewModule,
    RadioButtonModule,
    ButtonModule,
    OverlayPanelModule,
    PaginationComponentModule,
    CalendarModule,
    ViewDataFilterModule,
    TableModule,
    MultiSelectModule,
    InputTextModule,
    SliderModule,
    ProgressBarModule,
    SkeletonModule,
    ProgressSpinnerModule,
    SharedModule,
    SkeletonModule,
    SortablejsModule.forRoot({ animation: 200 }),
  ],
  declarations: [
    NewDashboardComponent,
    FilterDashboardComponent,
    TableDashboardComponent,
  ],
})
export class NewDashboardModule {}
