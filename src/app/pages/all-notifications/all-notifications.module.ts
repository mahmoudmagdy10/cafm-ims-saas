import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllNotificationsComponent } from './all-notifications.component';
import { PaginationComponentModule } from 'src/app/shared/components/pagination-component/pagination-component.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: AllNotificationsComponent,
      },
    ]),
    PaginationComponentModule
  ],
  declarations: [AllNotificationsComponent, ],
})
export class AllNotificationsModule {}
