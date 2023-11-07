import { SharedModule } from 'src/app/shared/Shared.module';
import { DropdownModule } from 'primeng/dropdown';
import { TranslateModule } from '@ngx-translate/core';
import { FieldManagmentComponent } from './FieldManagment.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesManagmentAccidentComponent } from './categories-managment/categories-managment.component';
import { addFieldsAccidentComponent } from './addField/addFields.component';
import { IconFieldModule } from '../icon-field/icon-field.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MatRadioModule } from '@angular/material/radio';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TooltipModule } from 'primeng/tooltip';
import { SelectParentFieldComponent } from './select-parent-field/select-parent-field.component';



@NgModule({
  declarations: [    FieldManagmentComponent,
    CategoriesManagmentAccidentComponent,
    addFieldsAccidentComponent,
    SelectParentFieldComponent,],
  imports: [
    CommonModule,
    SharedModule,
    TranslateModule,
    IconFieldModule,
    Ng2SearchPipeModule,
    ReactiveFormsModule,
    ProgressSpinnerModule,
    DragDropModule,
    DropdownModule,
    TooltipModule,
    FormsModule,
    MatRadioModule
  ],
  exports:[  FieldManagmentComponent,
    CategoriesManagmentAccidentComponent,
    addFieldsAccidentComponent,]
})
export class FieldManagmentModule { }
