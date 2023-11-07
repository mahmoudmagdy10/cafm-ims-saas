import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { DropdownModule } from 'primeng/dropdown';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackBugsComponent } from './track-bugs.component';
import { PaginationComponentModule } from 'src/app/shared/components/pagination-component/pagination-component.module';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ReactiveFormsModule } from '@angular/forms';
import { ViewJsonComponent } from './view-json/view-json.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: TrackBugsComponent }]),
    PaginationComponentModule,
    ProgressSpinnerModule,
    DropdownModule,
    TranslateModule,
    ReactiveFormsModule,
    MatDialogModule,
  ],
  declarations: [TrackBugsComponent, ViewJsonComponent],
})
export class TrackBugsModule {}
