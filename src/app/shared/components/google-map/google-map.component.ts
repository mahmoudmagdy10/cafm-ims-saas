import { EventHandlerUtil } from './../../../_metronic/kt/_utils/EventHandlerUtil';
import { map } from 'rxjs/operators';
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { GMap } from 'primeng/gmap';

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styles: [
    `
      agm-map {
        height: 300px;
      }
    `,
  ],
})
export class GoogleMapComponent implements OnInit {
  constructor(private cdr: ChangeDetectorRef) {}
  @Input() option: any;
  @Input() canNotEdit: boolean;
  @Input() infoWindowContext: any;
  options: any;
  @ViewChild('gmap') gmap: GMap;

  overlays: any[];

  markerTitle: string;

  selectedPosition: any;
  infoWindow: any;
  loading: boolean = false;
  ngOnInit(): void {
    this.infoWindow = new google.maps.InfoWindow();

    this.options = {
      center: {
        lat: this.option.Latitude
          ? this.option.Latitude
          : this.option?.CenterLatitude || 29.378586,
        lng: this.option.Longitude
          ? this.option.Longitude
          : this.option?.CenterLongitude || 47.990341,
      },
      zoom: this.option.Zoom ? this.option.Zoom : 12,
      mapTypeId: google.maps.MapTypeId.SATELLITE,
    };
    this.initOverlays();
  }

  addMarker(lat: number, lng: number, convertCenterToThisPoint?: boolean) {
    this.overlays = [];
    this.overlays.push(
      new google.maps.Marker({
        position: {
          lat: lat,
          lng: lng,
        },
        title: this.option.Name,
        draggable: true,
      })
    );

    if (convertCenterToThisPoint) {
      this.loading = true;
      setTimeout(() => {
        this.options = {
          center: {
            lat: lat,
            lng: lng,
          },
          zoom: 12,
        };
        this.loading = false;
      }, 1000);

      this.cdr.detectChanges();
    }
  }
  handleMapClick(event: any) {
    this.selectedPosition = event.latLng;
    if (!this.canNotEdit) {
      this.addMarker(this.selectedPosition.lat(), this.selectedPosition.lng());
    }
  }
  initOverlays() {
    if (this.option.Latitude) {
      this.overlays = [
        new google.maps.Marker({
          position: { lat: this.option.Latitude, lng: this.option.Longitude },
          title: this.option.Name,
          draggable: !this.canNotEdit,
        }),
        // new google.maps.Marker({
        //   position: { lat: 36.883707, lng: 30.689216 },
        //   title: 'Ataturk Park',
        // }),
        // new google.maps.Marker({
        //   position: { lat: 36.885233, lng: 30.702323 },
        //   title: 'Oldtown',
        // }),
        // new google.maps.Polygon({
        //   paths: [
        //     { lat: 36.9177, lng: 30.7854 },
        //     { lat: 36.8851, lng: 30.7802 },
        //     { lat: 36.8829, lng: 30.8111 },
        //     { lat: 36.9177, lng: 30.8159 },
        //   ],
        //   strokeOpacity: 0.5,
        //   strokeWeight: 1,
        //   fillColor: '#1976D2',
        //   fillOpacity: 0.35,
        // }),
        //   new google.maps.Circle({
        //     center: { lat: 36.90707, lng: 30.56533 },
        //     fillColor: '#1976D2',
        //     fillOpacity: 0.35,
        //     strokeWeight: 1,
        //     radius: 1500,
        //   }),
        //   new google.maps.Polyline({
        //     path: [
        //       { lat: 36.86149, lng: 30.63743 },
        //       { lat: 36.86341, lng: 30.72463 },
        //     ],
        //     geodesic: true,
        //     strokeColor: '#FF0000',
        //     strokeOpacity: 0.5,
        //     strokeWeight: 2,
        //   }),
      ];
    }
  }

  handleDragEnd(event: any) {
    this.selectedPosition = event.overlay.position;
  }
  handleOverlayClick(event: any) {
    if (this.infoWindowContext) {
      let title = event.overlay.getTitle();

      this.infoWindow.setContent(this.infoWindowContext);

      this.infoWindow.open(event.map, event.overlay);
      event.map.setCenter(event.overlay.getPosition());
    }
  }
}
