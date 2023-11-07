import { SharedModule } from './../../shared/Shared.module';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { TranslateModule } from '@ngx-translate/core';
import { Router, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackupComponent } from './Backup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FieldsetModule } from 'primeng/fieldset';
import { ChipModule } from 'primeng/chip';
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: BackupComponent,
      },
    ]),
    TranslateModule,
    DropdownModule,
    // FormsModule,
    ChipModule,
    FormsModule,
    FieldsetModule,
    CalendarModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  declarations: [BackupComponent],
})
export class BackupModule {}
