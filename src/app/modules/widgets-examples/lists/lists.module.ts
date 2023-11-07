import { TooltipModule } from 'primeng/tooltip';
import { ListsComponent } from './lists.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { InlineSVGModule } from 'ng-inline-svg';




@NgModule({
  declarations: [
    ListsComponent
  ],
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ListsComponent
      }
    ]),
    TooltipModule,
    InlineSVGModule,

  ]
})
export class ListsModule {

}
