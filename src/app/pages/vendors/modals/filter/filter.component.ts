import { ViewDataFilterService } from 'src/app/shared/components/view-data-filter/view-data-filter.service';
import { FieldManagmentService } from 'src/app/shared/components/FieldManagment/FieldManagment.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormBuilder, FormControl, UntypedFormGroup } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { VendorsService } from '../../vendors.service';

@Component({
  selector: 'app-copy-setting',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit {
  // dialogRef: any;
  formFilter!: UntypedFormGroup;
  lablesFilter: any;
  constructor(
    public dialogRef: MatDialogRef<FilterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: UntypedFormBuilder,
    private service: VendorsService,
    public fieldManagmentService: FieldManagmentService,
    private _viewDataFilterService: ViewDataFilterService
  ) {
    this.formFilter = this.fb.group({
      VendorName: [''],
      Email: [''],
      Phone: [null],
    });
  }

  ngOnInit(): void {
    this.formFilter.patchValue(
      this._viewDataFilterService?.filter?.value?.['Vendors']?.dataFilter
        ?.params
    );
  }

  get formFilterValue() {
    return this.formFilter.value;
  }
  Close() {
    this.dialogRef.close();
  }
  Filter() {
    this.lablesFilter = [];
    if (this.formFilterValue.VendorName) {
      this.lablesFilter.push({
        label: 'Vendor Name',
        value: this.formFilterValue.VendorName,
      });
    }
    if (this.formFilterValue.Phone) {
      this.lablesFilter.push({
        label: 'Phone',
        value: this.formFilterValue.Phone,
      });
    }
    if (this.formFilterValue.Email) {
      this.lablesFilter.push({
        label: 'Email',
        value: this.formFilterValue.Email,
      });
    }
    this._viewDataFilterService.setDataFilter('Vendors', {
      forview: this.lablesFilter,
      params: {
        ...this.formFilter.value,
      },
    });

    this.service.getAllVendors();
    this.dialogRef.close();
  }
}
