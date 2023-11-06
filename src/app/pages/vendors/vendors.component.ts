import { UntypedFormControl } from '@angular/forms';
import { AuthService } from './../../modules/auth/services/auth.service';
import { tap, finalize, map, skip } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { FieldManagmentService } from './../../shared/components/FieldManagment/FieldManagment.service';
import { Observable, Subscription } from 'rxjs';
import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddNewVendorComponent } from './modals/addNewVendor/addNewVendor.component';
import { FilterComponent } from './modals/filter/filter.component';
import { VendorCardComponent } from './modals/vendor-card/vendor-card.component';
import { VendorsService } from './vendors.service';
import { FieldManagmentComponent } from 'src/app/shared/components/FieldManagment/FieldManagment.component';
import { ViewItemInFieldService } from 'src/app/shared/components/ViewFieldInItem/view-field-in-item.service';
import { ViewDataFilterService } from 'src/app/shared/components/view-data-filter/view-data-filter.service';

@Component({
  selector: 'app-vendors',
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.scss'],
})
export class VendorsComponent implements OnInit, OnDestroy {
  AllVendors$: Observable<any>;
  idVendorDeleted: number | string;
  interval: any;
  subscription: Subscription;
  feildsViewInTable: any;
  LocationSelected = new UntypedFormControl();
  selectedPageVendor: any = 1;
  subscriptionForDataFilter: Subscription;
  RowCount: any = 50;
  constructor(
    public dialog: MatDialog,
    private service: VendorsService,
    public fieldManagmentService: FieldManagmentService,
    private addFieldService: ViewItemInFieldService,
    private toastr: ToastrService,
    private auth: AuthService,
    private _viewDataFilterService: ViewDataFilterService
  ) {}
  Codes$: Observable<any>;
  ngOnInit(): void {
    // this.subscriptionForDataFilter = this._viewDataFilterService
    //   .SelectorFilterByComponent$('Vendors', 'dataFilter')
    //   .pipe(skip(1))
    //   .subscribe((value) => {
    //     this.service.getAllVendors();
    //   });
    this.LocationSelected.setValue(+localStorage.getItem('defaultLocation')!);

    this.Codes$ = this.service.getCodeObz$();

    this.LocationSelected.valueChanges.subscribe((Value) => {
      this.service.getAllVendors({ LocationId: this.LocationSelected.value });
    });
    this.service.getCodeVendors();
    this.service.getAllVendors({ LocationId: this.LocationSelected.value });
    this.AllVendors$ = this.service.getAllVendorsObz$();
    this.fieldManagmentService.ComponentType = 'Vendors';
    this.addFieldService.ComponentType = 'Vendors';
    this.fieldManagmentService.getFeild();
    this.Refresh();
    this.dataLocation();
    this.service.selectedPageVendor$.subscribe((value) => {
      this.selectedPageVendor = 1;
      this.service.selectedPageVendor = 1;
    });
  }
  locations: any;
  dataLocation() {
    this.locations = JSON.parse(localStorage.getItem('locations')!);
  }
  Refresh() {
    this.subscription = this.auth.getonTimer().subscribe((value: any) => {
      if (this.interval) {
        clearInterval(this.interval);
      }

      let TimerRefresh = localStorage.getItem('TimerRefresh');

      if (TimerRefresh != '0' && TimerRefresh != 'now' && TimerRefresh) {
        this.interval = setInterval(() => {
          this.service.getCodeVendors();
          this.service.getAllVendors({
            LocationId: this.LocationSelected.value,
          });
        }, +TimerRefresh);
      } else if (value == 'now') {
        this.service.getCodeVendors();
        this.service.getAllVendors({ LocationId: this.LocationSelected.value });
      }
    });
  }
  filter() {
    const dialogRef = this.dialog
      .open(FilterComponent, {
        width: '60vw',
        data: {},
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');

    dialogRef.afterClosed().subscribe((result) => {});
  }

  AddNewVendor() {
    const dialogRef = this.dialog
      .open(AddNewVendorComponent, {
        width: '70vw',
        // height: '95%',
        data: {},
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');

    dialogRef.afterClosed().subscribe((result) => {});
  }

  openCardVendor(item: any) {
    const dialogRef = this.dialog
      .open(VendorCardComponent, {
        width: '70vw',
        // height: '95%',
        data: item,
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');

    dialogRef.afterClosed().subscribe((result) => {
      this.service.getAllVendors({ LocationId: this.LocationSelected.value });
    });
  }
  fieldsManagment() {
    const dialogRef = this.dialog
      .open(FieldManagmentComponent, {
        width: '60vw',
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');

    dialogRef.afterClosed().subscribe((result) => {});
  }
  deleteVendor() {
    this.service.deleteVendor(this.idVendorDeleted).subscribe(
      (res: any) => {
        if (res.rv > 0) {
          this.service.getAllVendors({
            LocationId: this.LocationSelected.value,
          });
        } else {
        }
      },
      (err) => {}
    );
  }
  ValueField(idFeildsViewInTable: any, AccidentFields: any) {
    if (AccidentFields) {
      for (var i = 0; i < AccidentFields.length; ) {
        if (AccidentFields[i].FieldId == idFeildsViewInTable) {
          return AccidentFields[i].FieldValue;
        } else {
          i = i + 1;
        }
      }
    }
  }
  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.subscription?.unsubscribe();
  }
  export() {
    this.service.getDataForExcel();
  }
  changeListPage() {
    this.service.selectedPageVendor = this.selectedPageVendor;
    this.service.getAllVendors();
  }

  Filter() {
    const dialogRef = this.dialog
      .open(FilterComponent, {
        width: '60vw',
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        this.service.getAllVendors();
      }
    });
  }
  selectedRowCount(RowCount: any) {
    this.RowCount = RowCount;
    this.service.RowCount = RowCount;
    this.service.getAllVendors();
  }
}
