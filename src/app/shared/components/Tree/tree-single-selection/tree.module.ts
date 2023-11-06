import { NgModule } from '@angular/core';
import { TreeModule } from 'primeng/tree';
import { TreeSingleSelectionComponent } from './tree.component';
import { ContextMenuModule } from 'primeng/contextmenu';

@NgModule({
  imports: [TreeModule, ContextMenuModule],
  exports: [TreeSingleSelectionComponent,ContextMenuModule],
  declarations: [TreeSingleSelectionComponent],
})
export class TreeSingleSelectionModule {}
