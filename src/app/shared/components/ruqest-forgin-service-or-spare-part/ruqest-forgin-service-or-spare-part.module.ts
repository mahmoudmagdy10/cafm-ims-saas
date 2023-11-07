import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DropdownModule } from 'primeng/dropdown';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialogModule } from '@angular/material/dialog';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestSparePartComponent } from './request-spare-part/request-spare-part.component';
import { RequestForeignServiceComponent } from './request-foreign-service/request-foreign-service.component';

@NgModule({
  declarations: [RequestForeignServiceComponent, RequestSparePartComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    TranslateModule,
    TooltipModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    DropdownModule,
    MatAutocompleteModule,
    FormsModule,
  ],
  exports: [RequestForeignServiceComponent, RequestSparePartComponent],
})
export class RuqestForginServiceOrSparePartModule {}
