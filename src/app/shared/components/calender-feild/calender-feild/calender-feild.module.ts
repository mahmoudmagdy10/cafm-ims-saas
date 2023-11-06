import { TranslationModule } from './../../../../modules/i18n/translation.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalenderFeildComponent } from './calender-feild.component';

@NgModule({
  imports: [
    CommonModule,
    CommonModule,
    CalendarModule,
    FormsModule,
    TranslationModule,
    ReactiveFormsModule,
  ],
  declarations: [CalenderFeildComponent],
  exports: [CalenderFeildComponent],
})
export class CalenderFeildModule {}
