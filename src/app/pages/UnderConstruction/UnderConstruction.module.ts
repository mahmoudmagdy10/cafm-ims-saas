import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { DataViewModule } from 'primeng/dataview';
import { CommonModule } from '@angular/common';
import { UnderConstructionComponent } from './UnderConstruction.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [UnderConstructionComponent],
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: UnderConstructionComponent,
      },
    ]),
    TooltipModule,
    DataViewModule,
    CommonModule,
    DialogModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    DropdownModule,
    ButtonModule,
    TranslateModule.forChild(),
  ],
})
export class UnderConstructionModule {}
