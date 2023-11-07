import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilesBackupComponent } from './FilesBackup.component';
import { RouterModule } from '@angular/router';
import { CardFileComponent } from './card4/card4.component';
import {BreadcrumbModule} from 'primeng/breadcrumb';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: FilesBackupComponent,
      },
    ]),
    TranslateModule,
    BreadcrumbModule
  ],
  declarations: [FilesBackupComponent, CardFileComponent],
})
export class FilesBackupModule {}
