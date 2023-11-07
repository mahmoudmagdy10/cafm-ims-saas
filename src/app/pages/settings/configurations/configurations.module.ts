import { DropdownModule } from 'primeng/dropdown';
import { SharedModule } from '../../../shared/Shared.module';
import { praiortyComponent } from './modals/priorityModal/priorityModal.compnent';
import { tagsmanagementComponent } from './modals/tagsmanagementModal/tagsmanagementModal.component';
import { TranslateModule } from '@ngx-translate/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CalendarModule } from 'primeng/calendar';
import { InlineSVGModule } from 'ng-inline-svg';
import { PrimeModule } from './../prime.module';
import { ConfigurationsComponent } from './configurations.component';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import {InputSwitchModule} from 'primeng/inputswitch';
import {ColorPickerModule} from 'primeng/colorpicker';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AccordionModule } from 'primeng/accordion';
import { ReasonsModalComponent } from './modals/reasons-modal/reasons-modal.component';

@NgModule({
  declarations: [
    ConfigurationsComponent,
    praiortyComponent,
    tagsmanagementComponent,
    ReasonsModalComponent,
  ],
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ConfigurationsComponent
      }
    ]),
    PrimeModule,
    CommonModule,
    FormsModule,
    InlineSVGModule,
    TooltipModule,
    ReactiveFormsModule,
    CalendarModule,
    MatTooltipModule,
    MatSelectModule,
    BsDatepickerModule.forRoot(),
    TranslateModule.forChild(),
    MatDialogModule,
    InputSwitchModule,
    ColorPickerModule,
    DragDropModule,
    SharedModule,
    AccordionModule,
    DropdownModule

  ]
})
export class ConfigurationsModule {

}
