import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  FormControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { VendorsService } from '../../vendors.service';

@Component({
  selector: 'app-copy-setting-vendor',
  templateUrl: './addNewVendor.component.html',
  styleUrls: ['./addNewVendor.component.scss'],
})
export class AddNewVendorComponent implements OnInit {
  Codes$: Observable<any>;
  LocationSelected: any[] = [];
  vendorForm: UntypedFormGroup;
  constructor(
    public dialogRef: MatDialogRef<AddNewVendorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: VendorsService,
    private fb: UntypedFormBuilder,
    private toastr: ToastrService
  ) {
    // , Validators.email
    this.vendorForm = this.fb.group({
      VendorName: ['', Validators.required],
      LicenseNumber: [''],
      ContactPerson: [''],
      Email: ['', [Validators.required]],
      Phone: [''],
      Address: [''],
    });
  }

  ngOnInit(): void {
    this.Codes$ = this.service.getCodeObz$();
  }

  Close() {
    this.dialogRef.close();
  }
  selectLocation(event: any, codeLocation: any) {
    if (event.target.value) {
      this.LocationSelected.push(codeLocation);
    } else {
      this.LocationSelected.forEach((value, index) => {
        if (value == codeLocation) {
          this.LocationSelected.splice(index, 1);
        }
      });
    }
  }

  onSave() {
    if (this.vendorForm.valid) {
      const body = {
        ...this.vendorForm.value,
        LocationIds: this.LocationSelected.join(','),
        CompanyId: localStorage.getItem('companyId'),
      };
      this.service.AddVendor(body).subscribe(
        (res: any) => {
          if (res.rv > 0) {

            this.service.getAllVendors();
            this.dialogRef.close();
          }else {

          }
        },
        (err) => {
          this.toastr.error(err.Msg);
        }
      );
    } else {
      this.toastr.error(document.dir=='rtl'?'يرجى ادخال الحقول المطلوبة':'Enter All Field Required');
    }
  }
}
