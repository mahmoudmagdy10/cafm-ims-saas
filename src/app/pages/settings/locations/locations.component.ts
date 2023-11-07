import { ViewDataFilterService } from './../../../shared/components/view-data-filter/view-data-filter.service';
import { assetsScreenService } from './../../assetsScreen/assetsScreen.service';
import { FieldManagmentService } from 'src/app/shared/components/FieldManagment/FieldManagment.service';
import { environment } from 'src/environments/environment';
import { AuthService } from './../../../modules/auth/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { finalize, map, shareReplay, skip, take, tap } from 'rxjs/operators';
import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { LocationService } from './locations.service';
import { MatDialog } from '@angular/material/dialog';
import { modalEditComponent } from './modalLocation/modalEdit/modalEdit.component';
import { Router } from '@angular/router';
import { LocationReportSettingComponent } from './modalLocation/location-report-setting/location-report-setting.component';
import { addAssetsComponent } from '../../assetsScreen/addAssets/addAssets.component';
import { cardAssetsModalComponent } from '../../assetsScreen/cardAsset/cardAssetByModal/cardAssetModal.component';
import { FilterLocationComponent } from './modalLocation/filter/filter.component';

@Component({
  selector: 'locations',
  templateUrl: 'locations.component.html',
  styleUrls: ['./locations.component.scss'],
})
export class locationsComponent implements OnInit, OnDestroy {
  displayAdd: boolean = false;
  displayDelete: boolean = false;
  displayEmail: boolean = false;
  displayThemesEmails: boolean = false;
  displayEditLoc: boolean = false;
  displayNameLoc: boolean = false;
  DataLocation$: Observable<any>;
  CodeLocation$: Observable<any>;
  getLocation$: Observable<any>;
  LocationIdDeleted: any;
  LocationIdDeletedIndex: number;
  ViewWay: number = 2;
  loading$ = new BehaviorSubject(false);
  interval: any;
  subscription: Subscription;
  codes: any;
  Avatar = environment.Avatar;
  DataFeild$: Observable<any>;
  feildsViewInTable: any[] = [];
  typeView = 'list';
  initialPerants: any[] = [];
  typeLoc: any;
  selectedPageLocations: any = 1;
  dataTree$: Observable<any>;
  Filter: {};
  subscriptionForDataFilter: Subscription;
  RowCount: any = 50;

  get WorkOrderSelected() {
    return this.LocationService.locationSelected;
  }
  openAddAsset(isLocation?: boolean) {
    const dialogRef = this.dialog
      .open(addAssetsComponent, {
        width: '60vw',
        disableClose: true,
        data: { isLocation: isLocation },
      })

      .addPanelClass('cmms-custom-modal');
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
      }
    });
  }

  constructor(
    private LocationService: LocationService,
    private toster: ToastrService,
    private auth: AuthService,
    public dialog: MatDialog,
    private router: Router,
    private fieldManagmentService: FieldManagmentService,
    private _assetsScreenService: assetsScreenService,
    private cdr: ChangeDetectorRef,
    private _viewDataFilterService: ViewDataFilterService
  ) {}

  ngOnInit(): void {
    this.subscriptionForDataFilter = this._viewDataFilterService
      .SelectorFilterByComponent$('locations', 'dataFilter')
      .pipe(skip(1))
      .subscribe((value) => {
        this.LocationService.GetLocationAndSubLocation();
      });
    // this.LocationService.checkServerStatus();
    this._assetsScreenService.getCodeAssets();
    this.getLocation();

    this.getLocation$ = this.LocationService.locationsAndSubLocation$.pipe(
      tap((val) => {
        this.typeLoc = val?.Data?.type;
      })
    );
    this.CodeLocation$ = this.LocationService.getCodeLocation();
    this.CodeLocation$.subscribe((value) => {
      this.codes = value;
    });
    this.subscription = this.auth.getonTimer().subscribe((value: any) => {
      if (this.interval) {
        clearInterval(this.interval);
      }
      let TimerRefresh = localStorage.getItem('TimerRefresh');

      if (TimerRefresh != '0' && TimerRefresh != 'now' && TimerRefresh) {
        this.interval = setInterval(() => {
          this.getLocation();
        }, +TimerRefresh);
      } else if (value == 'now') {
        this.getLocation();
      }
    });
    //
    this.LocationService.selectedPageLocations$.subscribe((value) => {
      console.log(
        'resetSelectedpage',
        this.LocationService.selectedPageLocations
      );

      this.selectedPageLocations = 1;
      this.LocationService.selectedPageLocations = 1;
    });
    this.LocationService.getLocation();
    this.dataTree$ = this.LocationService.locationList$.pipe(
      map((data: any) => {
        return data?.map((item: any) => {
          return {
            // ...item,
            label: item?.LocationName,
            key: item?.LocationId,
            data: 'Documents Folder',
            expandedIcon: 'pi pi-folder-open',
            collapsedIcon: 'pi pi-folder',
            leaf: !item?.HasSubLocation,
            loading: false,
            superLocation: true,
            Type: item?.type,
            id: item?.id,
            LocationId: item?.LocationId,
            // ParentId: 0,
          };
        });
      }),
      tap((value: any) => {
        this.initialPerants = value;
      })
    );
  }

  showModalAdd() {
    this.displayAdd = true;
  }
  showModalDelete() {
    this.displayDelete = true;
  }
  showModalEmail() {
    this.displayEmail = true;
  }

  showModalNameLoc() {
    this.displayNameLoc = true;
  }

  showModalThemesEmails() {
    this.displayThemesEmails = true;
  }
  CloseModalThemesEamil() {
    this.displayThemesEmails = false;
  }
  //
  onDeleteLocation() {
    if (this.LocationIdDeleted.type == 'loc') {
      this.LocationService.deleteLoc({
        LocationId: this.LocationIdDeleted?.LocationId,
      }).subscribe((res: any) => {
        if (res.rv > 0) {
          this.DataLocation$ = this.DataLocation$.pipe(
            map((value: any[], index) => {
              value.splice(this.LocationIdDeletedIndex, 1);
              return value;
            })
          );

          this.getLocation();
        } else {
          this.toster.error(res.Msg);
        }
      });
    } else {
      this.LocationService.deleteAsset(this.LocationIdDeleted?.id).subscribe(
        (res: any) => {
          if (res.rv > 0) {
            this.DataLocation$ = this.DataLocation$.pipe(
              map((value: any[], index) => {
                value.splice(this.LocationIdDeletedIndex, 1);
                return value;
              })
            );

            this.getLocation();
          } else {
            this.toster.error(res.Msg);
          }
        }
      );
    }
  }
  getLocation() {
    this.LocationService.getLocation();

    this.LocationService.GetLocationAndSubLocation();
    this.loading$.next(false);
    this.DataLocation$ = this.LocationService.locationsAndSubLocation$
      .pipe
      // tap((res) => {
      //   if (res?.Data) {
      //     this.initialPerants = res.Data.filter(
      //       (value: any) => value.type == 'loc'
      //     )?.map((item: any) => {
      //       console.log('ddddddd', item);

      //       return {
      //         // ...item,
      //         label: item?.title,
      //         key: item?.title,
      //         data: 'Documents Folder',
      //         expandedIcon: 'pi pi-folder-open',
      //         collapsedIcon: 'pi pi-folder',
      //         leaf: !item?.HasSubLocation,
      //         loading: false,
      //         superLocation: true,
      //         Type: item?.type,
      //         id: item?.id,
      //         LocationId: item?.LocationId,
      //         // ParentId: 0,
      //       };
      //     });
      //     this.cdr.detectChanges();
      //   }
      //   this.loading$.next(false);
      // })
      ();
  }

  loadingValue$() {
    return this.loading$.asObservable();
  }
  showModalEditLoc(LocationId: any, disabled = false) {
    const dialogRef = this.dialog
      .open(modalEditComponent, {
        width: '60vw',
        data: {
          Codes: this.codes,
          LocationId: LocationId,
          disabled: disabled,
        },
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');

    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'onSave') {
        this.getLocation();
      }
    });
  }
  LocationReportSetting(locationId: any) {
    const dialogRef = this.dialog.open(LocationReportSettingComponent, {
      width: '50vw',
      disableClose: true,
      data: locationId,
    });
  }
  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.subscription?.unsubscribe();
  }
  export() {
    this.LocationService.getDataForExcel();
  }
  usersByLocation(LocationId: any, LocationName: any) {
    this.router.navigate(['/settings/users'], {
      queryParams: {
        LocationId: LocationId,
        LocationName: LocationName,
      },
    });
  }
  outSideActionSelect(item: any, isDisable?: boolean) {
    if (item?.Type == 'loc' || item?.type == 'loc') {
      this.showModalEditLoc(item?.LocationId, isDisable);
    } else {
      this.assetCard(item?.id || item?.ID, item?.LocationId);
      // window.open(`Asset/card/${item.ID}`, '_blank');
    }
  }
  assetCard(ID: any, LocationId: any) {
    const dialogRef = this.dialog
      .open(cardAssetsModalComponent, {
        width: '85vw',
        maxWidth: '85vw',
        data: {
          ID: ID,
          LocationId: LocationId,
        },
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');

    dialogRef.afterClosed().subscribe((result) => {});
  }
  selectSubLocation(event: any, item: any) {
    if (event.target.checked == true) {
      this.LocationService.locationSelected.push(item?.id, item);
    } else {
      this.LocationService.locationSelected.forEach((value, index) => {
        if (value == item?.id) {
          this.LocationService.locationSelected.splice(index, 1);
        }
      });
    }
  }
  deletSelected() {
    console.log(
      'deleteSelected',
      this.LocationService.locationSelected[1]?.type
    );
    const ids = this.LocationService.locationSelected[0];

    if (Array.isArray(ids)) {
      // Check if ids is an array
      if (this.LocationService.locationSelected[1]?.type == 'sub') {
        this.LocationService.deletSelectedAsset({
          ids: ids.join(','),
        }).subscribe(
          (res: any) => {
            if (res.rv > 0) {
              this.LocationService.locationSelected[0] = [];
              this.LocationService.GetLocationAndSubLocation();
              // this.dialogRef.close();
            } else {
              // Handle error
            }
          },
          (err: any) => {
            // Handle error
          }
        );
      } else {
        this.LocationService.deletSelectedAsset({
          ids: ids.join(','),
        }).subscribe(
          (res: any) => {
            if (res.rv > 0) {
              this.LocationService.locationSelected = [];
              this.LocationService.GetLocationAndSubLocation();
              // this.dialogRef.close();
            } else {
              // Handle error
            }
          },
          (err: any) => {
            // Handle error
          }
        );
      }
    } else {
      // Handle the case where ids is not an array
      console.error('ids is not an array');
    }
  }

  changeListPage() {
    this.LocationService.selectedPageLocations = this.selectedPageLocations;
    this.LocationService.GetLocationAndSubLocation();
  }
  filter() {
    const dialogRef = this.dialog
      .open(FilterLocationComponent, {
        width: '30vw',
        disableClose: true,
        data: this.Filter,
      })
      .addPanelClass('cmms-custom-modal');
    dialogRef.afterClosed().subscribe((dataFilter) => {
      if (dataFilter) {
        this.Filter = dataFilter;
        // this.LocationService.GetLocationAndSubLocation();
      }
    });
  }
  selectedRowCount(RowCount: any) {
    this.RowCount = RowCount;
    this.LocationService.RowCount = RowCount;
    this.LocationService.GetLocationAndSubLocation();
  }
}
