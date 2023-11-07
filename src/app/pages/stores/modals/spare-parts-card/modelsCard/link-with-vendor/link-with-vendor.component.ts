import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { SparePartService } from 'src/app/pages/stores/spare-parts.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-link-with-vendor',
  templateUrl: './link-with-vendor.component.html',
})
export class LinkWithVendorComponent implements OnInit {
  Codes$: Observable<any>;

  VendorForm = new UntypedFormGroup({
    vendorId: new UntypedFormControl(),
    vendorPartNumber: new UntypedFormControl(),
    vendorPrice: new UntypedFormControl(),
  });
  constructor(
    public dialogRef: MatDialogRef<LinkWithVendorComponent>,
    @Inject(MAT_DIALOG_DATA) public Params: any,
    private service: SparePartService
  ) {}

  ngOnInit(): void {
    this.Codes$ = this.service.Codes$;
  }
  Close() {
    this.dialogRef.close();
  }
  save() {
    this.dialogRef.close(this.VendorForm.value);
  }
}
