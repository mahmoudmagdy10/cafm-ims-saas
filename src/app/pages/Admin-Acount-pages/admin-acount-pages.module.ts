import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: 'administrator',
        loadChildren: () =>
          import('./administrator/administrator.module').then(
            (m) => m.administratorModule
          ),
      },
      {
        path: 'track-bugs',
        loadChildren: () =>
          import('./track-bugs/track-bugs.module').then(
            (m) => m.TrackBugsModule
          ),
      },
    ]),
  ],
})
export class AdminAcountPagesModule {}
