import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GMapModule } from 'primeng/gmap';
import { GoogleMapComponent } from './google-map.component';
import { MapCardWithOutDilogComponent } from './map-card-withoutDilog/map-card.component';
import { MapCardComponent } from './dilogGoogleMapSingleMarker/map-card/map-card.component';
import { ReactiveFormsModule } from '@angular/forms';
import {SkeletonModule} from 'primeng/skeleton';

@NgModule({
  declarations: [
    GoogleMapComponent,
    MapCardWithOutDilogComponent,
    MapCardComponent,
  ],
  imports: [CommonModule, GMapModule, TranslateModule, ReactiveFormsModule,SkeletonModule],
  exports: [GoogleMapComponent, MapCardWithOutDilogComponent, MapCardComponent,SkeletonModule],
})
export class GoogleMapModule {}
