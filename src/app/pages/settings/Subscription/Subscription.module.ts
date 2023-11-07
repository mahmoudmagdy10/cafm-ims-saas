import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { TranslateModule } from '@ngx-translate/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import {DialogModule} from 'primeng/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SubscriptionComponent } from './Subscription.component';
import { CreateOrEditSubComponent } from './CreateOrEditSub/CreateOrEditSub.component';


@NgModule({
  declarations: [SubscriptionComponent,CreateOrEditSubComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: SubscriptionComponent,
      },
    ]),
    // WidgetsModule,
    DialogModule,
    MatCheckboxModule,
    BsDatepickerModule.forRoot(),
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    TranslateModule.forChild(),
    MatDatepickerModule,
    MatNativeDateModule,
  ],
})
export class SubscriptionModule {}
