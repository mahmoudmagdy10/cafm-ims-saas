import { tap } from 'rxjs/operators';
import { ProcurementManagementService } from './../../procurement-management.service';
import { ViewDataFilterService } from './../../../../shared/components/view-data-filter/view-data-filter.service';
import {
  UntypedFormGroup,
  FormControl,
  Validators,
  UntypedFormBuilder,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  Inject,
} from '@angular/core';
import { Observable } from 'rxjs';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import * as moment from 'moment';

@Component({
  selector: 'filter',
  templateUrl: 'filter.component.html',
})
export class ProcurementManagementFilter implements OnInit {
  FormFilter!: UntypedFormGroup;
  lablesFilter: any;
  codes$!: Observable<any>;
  Codes: any;
  constructor(
    public dialogRef: MatDialogRef<ProcurementManagementFilter>,
    @Inject(MAT_DIALOG_DATA) public filter: any,
    public dialog: MatDialog,
    private fb: UntypedFormBuilder,
    private _viewDataFilterService: ViewDataFilterService,
    private _procurementManagementService: ProcurementManagementService
  ) {
    this.FormFilter = this.fb.group({
      PONumber: [null],
      POName: [''],
      POStatus: [null],
      POTypeId: [null],
      FromData: [''],
      ToData: [''],
      BudgetId: [null],
      VendorId: [null],
    });
  }
  get FormValue() {
    return this.FormFilter.value;
  }
  ngOnInit(): void {
    let filter =
      this._viewDataFilterService.datafilterModel['procurementManagement']
        ?.dataFilter?.params;
    this.FormFilter.patchValue(filter);
    this.codes$ = this._procurementManagementService.Codes$.pipe(
      tap((Codes) => {
        this.Codes = Codes;
      })
    );
  }
  Filter() {
    this.lablesFilter = [];
    if (this.FormValue.POName) {
      this.lablesFilter.push({
        label: 'PO Name',
        value: this.FormValue.POName,
      });
    }
    if (this.FormValue.PONumber) {
      this.lablesFilter.push({
        label: 'PO Number',
        value: this.FormValue.PONumber,
      });
    }
    if (this.FormValue.POStatus) {
      this.lablesFilter.push({
        label: 'PO Status',
        value: this.Codes.PurchaseOrdersStatus?.find(
          (value: any) => value.code == this.FormValue.POStatus
        ).name,
      });
    }
    if (this.FormValue.POTypeId) {
      this.lablesFilter.push({
        label: 'PO TypeId',
        value: this.Codes.PurchaseOrdersTypes?.find(
          (value: any) => value.code == this.FormValue.POTypeId
        ).name,
      });
    }
    if (this.FormValue.VendorId) {
      this.lablesFilter.push({
        label: 'Vendor',
        value: this.Codes.Vendors?.find(
          (value: any) => value.code == this.FormValue.VendorId
        ).name,
      });
    }
    if (this.FormValue.BudgetId) {
      this.lablesFilter.push({
        label: 'Budget',
        value: this.Codes.Budgets?.find(
          (value: any) => value.code == this.FormValue.BudgetId
        ).name,
      });
    }
    if (this.FormValue.FromData) {
      this.lablesFilter.push({
        label: 'DATE_FROM',
        value: moment(this.FormValue.FromData).format('YYYY-MM-DD'),
      });
    }
    if (this.FormValue.ToData) {
      this.lablesFilter.push({
        label: 'DATE_TO',
        value: moment(this.FormValue.ToData).format('YYYY-MM-DD'),
      });
    }
    this._viewDataFilterService.setDataFilter('procurementManagement', {
      forview: this.lablesFilter,
      params: {
        ...this.FormFilter.value,
      },
    });

    this.dialogRef.close();
  }

  Close() {
    this.dialogRef.close();
  }
}
