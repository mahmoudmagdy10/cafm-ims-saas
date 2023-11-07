import { TranslateModule } from '@ngx-translate/core';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/Shared.module';

import { PrimeModule } from './../prime.module';
import { TooltipModule } from 'primeng/tooltip';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DialogModule } from 'primeng/dialog';

import { DataViewModule } from 'primeng/dataview';

import { CommonModule } from '@angular/common';
import { trashComponent } from './trash.component';




@NgModule({
  declarations: [
    trashComponent
  ],
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: trashComponent
      }
    ]),
    TooltipModule,
    PrimeModule,
    DataViewModule,
    SharedModule,
    CommonModule,
    DialogModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    DropdownModule,
    ButtonModule,
    TranslateModule.forChild(),
  ]
})
export class trashModule {


}
