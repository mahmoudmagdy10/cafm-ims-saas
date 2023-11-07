import { GMap } from 'primeng/gmap';
import { AuthService } from './../../modules/auth/services/auth.service';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { WindowInfoComponent } from './window-info/window-info.component';
import { finalize, map, startWith, tap, take } from 'rxjs/operators';
import { LocationService } from './../settings/locations/locations.service';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { DashboardService } from './dashboard.service';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { DashboardFilter } from './filter/dashboard-filter.component';
import { UntypedFormControl } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  constructor(
    private service: DashboardService,
    private router: Router,
    private locationService: LocationService,
    public dialog: MatDialog,
    private auth: AuthService,
    private cdr: ChangeDetectorRef
  ) {}
  DashboardData$: Observable<any>;
  options: any;
  DataLocation$: Observable<any>;
  loading$ = new BehaviorSubject(false);
  overlays: any[] = [];
  infoWindow: any;
  locationsLatLonFound: any = [];
  @ViewChild('gmap') gmap: GMap;
  @ViewChild('batata') batata: any;
  dir: any;
  chartOptions: any;
  dataChartPlanned: any;
  dataChartCompletedTask: any;
  dataChartResponseTask: any;
  dataChartReopenCompletionRate: any;
  cur: string = localStorage.getItem('currencyName')!;
  LocationSelected = new UntypedFormControl();
  Avatar = environment.Avatar;
  plugins: any;
  subscription: Subscription;
  interval: any;
  locations: any;
  ngOnInit(): void {
    this.chartOptions = {

      // plugins: {
      tooltips: {
        enabled: false, // <-- this option disables tooltips
      },
      // },

      // plugins: {
      legend: {
        display: false,
        showTooltips: false,
        // labels: {
        //   color: '#495057',
        // },
        // },
      },
    };

    this.init();
    this.subscription = this.auth.getonTimer().subscribe((value: any) => {
      if (this.interval) {
        clearInterval(this.interval);
      }
      let TimerRefresh = localStorage.getItem('TimerRefresh');

      if (TimerRefresh != '0' && TimerRefresh != 'now' && TimerRefresh) {
        this.interval = setInterval(() => {
          this.getDashboard();
        }, +TimerRefresh);
      } else if (TimerRefresh == 'now') {
        this.getDashboard();
      }
    });
  }
  init() {
    this.locationService.GetLocation();
    this.dataLocation();
    this.DashboardData$ = this.service.dataDashboard$.pipe(
      tap((value) => {
        if (value?.data) {
          this.buildChart(value?.data);
        }
      }),
      // take(2),
      tap((value) => {
        if (value?.data) {
          this.getLocation(value?.data);
        }
      })
    );
    this.LocationSelected.valueChanges
      .pipe(startWith(''))
      .subscribe((value) => {
        this.getDashboard();
      });
    this.infoWindow = new google.maps.InfoWindow();
  }
  getDashboard() {
    this.service.GetDashboard(this.LocationSelected.value);
    this.cdr.detectChanges();
  }
  getLocation(dataDash: any) {
    this.DataLocation$ = this.locationService.location$;

    this.DataLocation$.pipe(
      map((value) => {
        if (value) {
          return value.map((value: any) => {
            return {
              Zoom: value.Zoom,
              Latitude: value.Latitude,
              Longitude: value.Longitude,
              LocationName: value.LocationName,
              LocationId: value.LocationId,
              ExtraInformation: value.ExtraInformation,
              AssestsCount: value.AssestsCount,
              UserCount: value.UserCount,
              WorkingDayCount: value.WorkingDayCount,
              NoOfRequest: value.NoOfRequest,
              SubLocation: value.SubLocation,
            };
          });
        } else {
          return false;
        }
      })
    ).subscribe((value) => {
      if (value) {
        this.loading$.next(true);
        setTimeout(() => {
          value.forEach((element: any) => {
            if (element.Latitude && element.Longitude) {
              this.locationsLatLonFound.push(element);
            }
          });

          this.options = {
            center: {
              lat: this.locationsLatLonFound[0]?.Latitude
                ? +this.locationsLatLonFound[0]?.Latitude
                : 29.378586,
              lng: this.locationsLatLonFound[0]?.Longitude
                ? +this.locationsLatLonFound[0]?.Longitude
                : 47.990341,
            },
            mapTypeId: 'satellite',
            zoom: dataDash?.ZoomData
              ? +JSON.parse(dataDash?.ZoomData)?.Zoom || 12
              : 12,
          };
          this.locationsLatLonFound.forEach((element: any) => {
            this.overlays.push(
              new google.maps.Marker({
                position: {
                  lat: +element.Latitude,
                  lng: +element.Longitude,
                },
                title: element.LocationName,
              })
            );
          });
          this.loading$.next(false);
        }, 500);
      } else {
        this.options = {
          center: {
            lat: 29.378586,
            lng: 47.990341,
          },
          mapTypeId: 'satellite',
          zoom: 12,
        };
      }
      this.cdr.detectChanges();
    });
  }
  routeInUser() {
    this.router.navigate(['settings/users']);
  }
  routeInAssets() {
    this.router.navigate(['Asset']);
  }
  routeInLocations() {
    this.router.navigate(['settings/locations']);
  }
  handleOverlayClick(event: any) {
    let isMarker = event.overlay.getTitle != undefined;
    if (isMarker) {
      let title = event.overlay.getTitle();
      const data = this.locationsLatLonFound.find(
        (value: any) => value.LocationName == title
      );

      const dialogRef = this.dialog
        .open(WindowInfoComponent, {
          width: '30vw',
          data: data,
          disableClose: true,
        })
        .addPanelClass('cmms-map-modal');

      dialogRef.afterClosed().subscribe((result) => {});
      event.map.setCenter(event.overlay.getPosition());
    }
  }
  Filter() {
    const dialogRef = this.dialog
      .open(DashboardFilter, {
        width: '60vw',
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');
  }

  dataLocation() {
    this.locations = JSON.parse(localStorage.getItem('locations')!);
  }

  changeLocation(lang: any) {}
  moveOn(route: string, query: any = {}) {
    this.router.navigate([route], {
      queryParams: query,
    });
  }

  ZoomChanged(event: any) {
    this.service.changeZoom(this.gmap.getMap()?.zoom);
  }
  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.subscription?.unsubscribe();
  }
  buildChart(value: any) {
    const Planned = value?.Planned;
    const Unplanned = value?.Unplanned;
    value.Planned = ((Planned / (Planned + Unplanned)) * 100 || 0).toFixed(1);
    value.Unplanned = ((Unplanned / (Planned + Unplanned)) * 100 || 0).toFixed(
      1
    );
    this.dataChartPlanned = {
      // labels: ['Planned', 'Unplanned'],
      datasets: [
        {
          data: [value?.Unplanned, value?.Planned],
          backgroundColor: ['red', '#66BB6A'],
          // hoverBackgroundColor: ['red', '#81C784'],
        },
      ],
    };
    this.dataChartCompletedTask = {
      // labels: ['CompletionTime', ' '],
      datasets: [
        {
          data: [value?.CompletionTime, 100 - +value?.CompletionTime],
          backgroundColor: ['#66BB6A', 'red'],
          // hoverBackgroundColor: [ '#81C784','red',],
        },
      ],
    };
    this.dataChartResponseTask = {
      // labels: ['CompletionTime', ' '],
      datasets: [
        {
          data: [
            70, 30,
            // ,
            // 100 - +value.ResponsiveTime,
          ],
          backgroundColor: ['#66BB6A', 'red'],
          // hoverBackgroundColor: [ '#81C784','red',],
        },
      ],
    };
    this.dataChartReopenCompletionRate = {
      // labels: ['CompletionTime', ' '],
      datasets: [
        {
          data: [
            value?.ReOpenTask,
            100 - +value?.ReOpenTask,
            // ,
            // 100 - +value.ResponsiveTime,
          ],
          backgroundColor: ['orange', 'green'],
          // hoverBackgroundColor: [ '#81C784','red',],
        },
      ],
    };
  }
}
