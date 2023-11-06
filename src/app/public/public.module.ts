import { ApplyComponent } from './maintenance-request/apply/apply.component';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'MaintenanceRequest',
        loadChildren: () =>
          import('./maintenance-request/maintenance-request.module').then(
            (m) => m.MaintenanceRequestModule
          ),
      },
    ]),
  ],
})
export class PublicModule {}
