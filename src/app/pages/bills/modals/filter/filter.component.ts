import { tap } from 'rxjs/operators';
import { BillsService } from './../../bills.service';
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
import { Observable, observable } from 'rxjs';
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
export class BillsFilter implements OnInit {
  FormFilter!: UntypedFormGroup;
  lablesFilter: any;
  codes$!: Observable<any>;
  Codes: any;
  constructor(
    public dialogRef: MatDialogRef<BillsFilter>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private fb: UntypedFormBuilder,
    private _viewDataFilterService: ViewDataFilterService,
    private _billsService: BillsService
  ) {
    this.FormFilter = this.fb.group({
      // POId: [null],
      BillStatusId: [null],
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
      this._viewDataFilterService.datafilterModel['Bills'].dataFilter?.params;
    this.FormFilter.patchValue(filter);
    this.codes$ = this._billsService.Codes$.pipe(
      tap((Codes) => {
        this.Codes = Codes;
      })
    );
  }
  Filter() {
    this.lablesFilter = [];
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
    this._viewDataFilterService.setDataFilter('Bills', {
      forview: this.lablesFilter,
      params: {
        ...this.FormFilter.value,
      },
    });

    // this._billsService.getBill();
    this.dialogRef.close();
  }

  Close() {
    this.dialogRef.close();
  }
}
