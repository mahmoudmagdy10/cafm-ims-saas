import { ViewAsTreeComponent } from './../../../../pages/assetsScreen/table-assets/view-as-tree/view-as-tree.component';
import { TreeSingleSelectionModule } from './../tree-single-selection/tree.module';
import { MatDialogModule } from '@angular/material/dialog';
import { NgModule } from '@angular/core';
import { TreeAssetsComponent } from './tree-assets.component';
import { TranslateModule } from '@ngx-translate/core';
import { ViewAsTreeModule } from 'src/app/pages/assetsScreen/table-assets/view-as-tree/view-as-tree.module';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    TreeSingleSelectionModule,
    MatDialogModule,
    TranslateModule,
    ViewAsTreeModule,
  ],
  exports: [ViewAsTreeModule],
  declarations: [TreeAssetsComponent],
  providers: [],
})
export class TreeAssetsModule {}
