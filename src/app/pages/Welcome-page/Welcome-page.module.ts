import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WelcomePageComponent } from './Welcome-page.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: WelcomePageComponent,
      },
    ]),
  ],
  declarations: [WelcomePageComponent],
})
export class WelcomePageModule {}
