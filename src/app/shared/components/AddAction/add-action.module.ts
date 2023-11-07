import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddActionComponent } from './add-action.component';
import { DialogModule } from 'primeng/dialog';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FileUploadModule } from 'primeng/fileupload';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


@NgModule({
  declarations: [AddActionComponent],
  imports: [
    CommonModule,
    DialogModule,
    InputSwitchModule,
    FileUploadModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    TranslateModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  exports: [AddActionComponent],
})
export class AddActionModule {}
