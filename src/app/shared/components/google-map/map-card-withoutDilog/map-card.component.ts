import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  ContentChild,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { GoogleMapComponent } from '../google-map.component';

@Component({
  selector: 'app-map-card-without-dilog',
  templateUrl: './map-card.component.html',
})
export class MapCardWithOutDilogComponent implements OnInit {
  constructor() {}
  @ViewChild('googleMap') googleMap: GoogleMapComponent;
  @Input() data: any;
  @Output() newLocation = new EventEmitter();
  @Input() width: string='100%';
  @Input() height: string='100px';


  ngOnInit(): void {}
  onSave() {
    if (this.googleMap.gmap.overlays.length > 0) {
      this.newLocation.emit({
        Longitude: this.googleMap.gmap.overlays[0].position.lng(),
        Latitude: this.googleMap.gmap.overlays[0].position.lat(),
        Zoom: this.googleMap.gmap.map.zoom,
        mapTypeId: 'hybrid',
      });
    }
  }
}
