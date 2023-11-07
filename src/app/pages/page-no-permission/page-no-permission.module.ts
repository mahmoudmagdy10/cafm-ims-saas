import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageNoPermissionComponent } from './page-no-permission.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [PageNoPermissionComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: PageNoPermissionComponent,
      },
    ]),
  ],
})
export class PageNoPermissionModule {}
