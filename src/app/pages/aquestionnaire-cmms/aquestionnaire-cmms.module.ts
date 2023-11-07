import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AquestionnaireCmmsComponent } from './aquestionnaire-cmms.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [AquestionnaireCmmsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: AquestionnaireCmmsComponent,
      },
    ]),
    TranslateModule.forChild(),
  ],
})
export class AquestionnaireCmmsModule {}
