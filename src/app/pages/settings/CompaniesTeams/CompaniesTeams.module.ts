import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../../shared/Shared.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule } from '@angular/forms';
import { CardsModule } from './../../../_metronic/partials/content/cards/cards.module';
import { InlineSVGModule } from 'ng-inline-svg';
import { PrimeModule } from './../prime.module';
import { TooltipModule } from 'primeng/tooltip';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CompaniesTeamsComponent } from './CompaniesTeams.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { FormsModule } from '@angular/forms';
import {BadgeModule} from 'primeng/badge';
@NgModule({
  declarations: [
    CompaniesTeamsComponent
  ],
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: CompaniesTeamsComponent
      }
    ]),
    TooltipModule,
    CommonModule,
    InlineSVGModule,
    ReactiveFormsModule,
    CardsModule,
    PrimeModule,
    ToastModule,
    MatProgressSpinnerModule,
    ProgressSpinnerModule,
    SharedModule,
    Ng2SearchPipeModule,
    FormsModule,
    TranslateModule.forChild(),
    TooltipModule,
    BadgeModule
  ]
})
export class CompaniesTeamsModule {

}
