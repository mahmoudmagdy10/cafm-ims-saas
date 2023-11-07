import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { CardsModule } from './../../../_metronic/partials/content/cards/cards.module';
import { DropdownMenusModule } from './../../../_metronic/partials/content/dropdown-menus/dropdown-menus.module';
import { ProfileModule } from './../../../modules/profile/profile.module';
import { ReactiveFormsModule } from '@angular/forms';
import { PrimeModule } from './../prime.module';
import { TooltipModule } from 'primeng/tooltip';
import { MyProfileComponent } from './my-profile.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { InputTextModule } from "primeng/inputtext";
import {ButtonModule} from 'primeng/button';
import {DialogModule} from 'primeng/dialog';
import { ImageCropperModule } from 'ngx-image-cropper';

// import filepond module
import { FilePondModule, registerPlugin } from 'ngx-filepond';

// import and register filepond file type validation plugin
import  * as FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import  * as FilepondPluginImageEdit from 'filepond-plugin-image-edit';
import  * as FilepondPluginImagePreview from 'filepond-plugin-image-preview';
registerPlugin(FilePondPluginFileValidateType,FilepondPluginImageEdit,FilepondPluginImagePreview);



@NgModule({
  declarations: [
    MyProfileComponent
  ],
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: MyProfileComponent
      }
    ]),
    TooltipModule,
    ReactiveFormsModule,
    PrimeModule,InputTextModule,ButtonModule,DialogModule,ImageCropperModule,
    FilePondModule,
    CardsModule,
    CommonModule,
    TranslateModule.forChild(),

    // ProfileModule
  ]
})
export class MyProfileModule {

}
