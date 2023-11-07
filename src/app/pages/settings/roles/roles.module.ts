import { MatDialogModule } from '@angular/material/dialog';
import { DashboardRolesComponent } from './dashboard-roles/dashboard-roles.component';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../../shared/Shared.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardsModule } from './../../../_metronic/partials/content/cards/cards.module';
import { InlineSVGModule } from 'ng-inline-svg';
import { PrimeModule } from './../prime.module';
import { TooltipModule } from 'primeng/tooltip';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RolesComponent } from './roles.component';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { IsCheckedAllPipe } from './is-checked-all.pipe';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { CheckboxModule } from 'primeng/checkbox';

@NgModule({
  declarations: [RolesComponent, IsCheckedAllPipe, DashboardRolesComponent],
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: RolesComponent,
      },
    ]),
    TooltipModule,
    CommonModule,
    InlineSVGModule,
    CardsModule,
    PrimeModule,
    ToastModule,
    MatProgressSpinnerModule,
    ProgressSpinnerModule,
    SharedModule,
    FormsModule,
    TranslateModule.forChild(),
    Ng2SearchPipeModule,
    MatDialogModule,
    CheckboxModule,
    ReactiveFormsModule,
  ],
})
export class RolesModule {}
