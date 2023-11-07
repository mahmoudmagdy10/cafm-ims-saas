import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewAsTreeComponent } from './view-as-tree.component';
import { TreeModule } from 'primeng/tree';
import { BlockUIModule } from 'primeng/blockui';
import { TooltipModule } from 'primeng/tooltip';
import { ReactiveFormsModule } from '@angular/forms';
import { confirmDeleteComponent } from 'src/app/shared/confirmDelete/confirmDelete.component';
import { SharedModule } from 'src/app/shared/Shared.module';
import { InputTextModule } from 'primeng/inputtext';

@NgModule({
  declarations: [ViewAsTreeComponent],
  imports: [
    CommonModule,
    TranslateModule,
    TreeModule,
    BlockUIModule,
    TooltipModule,
    ProgressSpinnerModule,
    ReactiveFormsModule,
    SharedModule,
    InputTextModule,
  ],
  exports: [ViewAsTreeComponent],
})
export class ViewAsTreeModule {}
