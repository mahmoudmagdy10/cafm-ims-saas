import { UntypedFormControl } from '@angular/forms';
import { GoogleMapComponent } from '../../google-map.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  ContentChild,
} from '@angular/core';

@Component({
  selector: 'app-map-card',
  templateUrl: './map-card.component.html',
})
export class MapCardComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<MapCardComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  @ViewChild('googleMap') googleMap: GoogleMapComponent;
  latControl = new UntypedFormControl();
  lngControl = new UntypedFormControl();
  ngOnInit(): void {}
  addPoint() {
    if (this.latControl.value && this.lngControl.value) {
      this.googleMap.addMarker(
        this.latControl.value,
        this.lngControl.value,
        true
      );
    }
  }
  onSave() {
    if (this.googleMap.gmap.overlays.length > 0) {
      this.dialogRef.close({
        Longitude: this.googleMap.gmap.overlays[0].position.lng(),
        Latitude: this.googleMap.gmap.overlays[0].position.lat(),
        Zoom: this.googleMap.gmap.map.zoom,
        mapTypeId: 'hybrid',
      });
    } else {
      this.dialogRef.close();
    }
  }
  remove() {
    if (this.googleMap.gmap.overlays.length > 0) {
      this.dialogRef.close({
        Longitude: null,
        Latitude: null,
        Zoom: this.googleMap.gmap.map.zoom,
      });
    }
  }
  Close() {
    this.dialogRef.close();
  }
}
