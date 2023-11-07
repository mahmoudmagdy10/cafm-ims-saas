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
import { SparePartService } from '../../spare-parts.service';
import { tap } from 'rxjs/operators';
import { ViewDataFilterService } from 'src/app/shared/components/view-data-filter/view-data-filter.service';

@Component({
  selector: 'stores-filter',
  templateUrl: 'stores-filter.component.html',
})
export class StoresFilter implements OnInit {
  listFieldsFilter: any[] = [];
  formFilter: UntypedFormGroup;
  codes$: Observable<any>;
  AssetSelected: any;
  lablesFilter: any;
  codes: any;
  constructor(
    public dialogRef: MatDialogRef<StoresFilter>,
    private fb: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) public filter: any,
    public dialog: MatDialog,
    private service: SparePartService,
    private _viewDataFilterService: ViewDataFilterService
  ) {
    this.formFilter = this.fb.group({
      Name: [],
      Number: [],
      CategoryId: [],
      StoreId: [],
      VendorId: [],
      ThresholdStatusId: [],
    });
  }
  get formFilterValue() {
    return this.formFilter.value;
  }
  ngOnInit(): void {
    this.formFilter.patchValue(this.filter);

    this.codes$ = this.service.Codes$.pipe(
      tap((val) => {
        this.codes = val;
      })
    );
  }
  onFilter() {
    this.service.getSpareParts(this.formFilter.value);
    this.dialogRef.close(this.formFilter.value);
  }
  Close() {
    this.dialogRef.close();
  }
  Filter() {
    this.lablesFilter = [];
    if (this.formFilterValue.Name) {
      this.lablesFilter.push({
        label: 'Name',
        value: this.formFilterValue.Name,
      });
    }
    if (this.formFilterValue.Number) {
      this.lablesFilter.push({
        label: 'Number',
        value: this.formFilterValue.Number,
      });
    }
    if (this.formFilterValue.CategoryId) {
      this.lablesFilter.push({
        label: 'Category',
        value: this.codes.Categories?.find(
          (value: any) => value.code == this.formFilterValue.CategoryId
        ).name,
      });
    }
    if (this.formFilterValue.StoreId) {
      this.lablesFilter.push({
        label: 'Store',

        value: this.codes.Stores?.find(
          (value: any) => value.code == this.formFilterValue.StoreId
        ).name,
      });
    }
    if (this.formFilterValue.VendorId) {
      this.lablesFilter.push({
        label: 'Vendor',
        value: this.codes.Vendors?.find(
          (value: any) => value.code == this.formFilterValue.VendorId
        ).name,
      });
    }
    if (this.formFilterValue.ThresholdStatusId) {
      this.lablesFilter.push({
        label: 'Status',
        value: this.codes.ThresholdStatus?.find(
          (value: any) => value.code == this.formFilterValue.ThresholdStatusId
        ).name,
      });
    }
    this._viewDataFilterService.setDataFilter('sparParts', {
      forview: this.lablesFilter,
      params: {
        AssetSelected: this.AssetSelected,
        ...this.formFilter.value,
      },
    });

    this.service.getSpareParts();
    this.dialogRef.close();
  }
}
