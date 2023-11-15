import { GMap } from 'primeng/gmap';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { map, startWith, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { DashboardService } from '../dashboard.service';
import { LocationService } from '../../settings/locations/locations.service';
import { AuthService } from 'src/app/modules/auth';
import { DashboardFilter } from '../filter/dashboard-filter.component';
import { WindowInfoComponent } from '../window-info/window-info.component';


@Component({
  selector: 'app-last-dashboard',
  templateUrl: './last-dashboard.component.html',
  styleUrls: ['./last-dashboard.component.scss']
})
export class LastDashboardComponent implements OnInit {
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
  showRejectedTask = true;
  // ------- my work
  locationName : string;
  cardsData:any;
  ngOnInit(): void {
    this.prepareData()

    this.chartOptions = {
      responsive: true,
      width: 50, // Set the width of the chart
      height: 50, // Set the height
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

  prepareData() {
    const companyDontUseRejectedTask = ['111'];
    const companyId = localStorage.getItem('companyId');
    this.showRejectedTask = companyId !== null && !companyDontUseRejectedTask.includes(companyId);
    const defaultLocationString = localStorage.getItem('defaultLocation');
    const currentLocationId = parseInt(defaultLocationString || '0', 10);
    const locationsString = localStorage.getItem('locations');
    if (locationsString) {
        try {
            const locationsArray = JSON.parse(locationsString);
            const location = locationsArray.find((loc: any) => loc.LocationId === currentLocationId);
            this.locationName = location?.LocationName; 
        } catch (error) {
            console.error('Error parsing locations data:', error);
        }
    }
}


  
  init() {
    this.locationService.GetLocation();
    this.dataLocation();
    this.DashboardData$ = this.service.dataDashboard$.pipe(
      tap((value) => {
        this.prepareData()
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
          backgroundColor: ['#F5375D', '#4ce37e'],
          // hoverBackgroundColor: ['red', '#81C784'],
        },
      ],
    };
    this.dataChartCompletedTask = {
      // labels: ['CompletionTime', ' '],
      datasets: [
        {
          data: [value?.CompletionTime, 100 - +value?.CompletionTime],
          backgroundColor: ['#4CE37E', 'red'],
          // hoverBackgroundColor: [ '#81C784','red',],
        },
      ],
    };
    this.dataChartResponseTask = {
      // labels: ['CompletionTime', ' '],
      datasets: [
        {
          data: [
            value.ResponsiveTime,
            100 - +value.ResponsiveTime,
          ],
          backgroundColor: ['#4CE37E', 'red'],
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
          backgroundColor: ['red', '#4ce37e'],
          // hoverBackgroundColor: [ '#81C784','red',],
        },
      ],
    };
  }

  imageProfile() {
    let avatarPath = localStorage.getItem('avatarPath');
    if (localStorage.getItem('avatarPath')) {
      return this.Avatar + avatarPath;
    }
  }
}
