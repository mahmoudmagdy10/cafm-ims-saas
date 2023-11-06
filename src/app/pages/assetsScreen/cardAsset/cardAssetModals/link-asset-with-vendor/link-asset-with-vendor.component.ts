import { FormGroup, UntypedFormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { assetsScreenService } from '../../../assetsScreen.service';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-link-asset-with-vendor',
  templateUrl: './link-asset-with-vendor.component.html',
})
export class LinkAssetWithVendorComponent implements OnInit {
  Codes$: Observable<any>;
  constructor(
    public dialogRef: MatDialogRef<LinkAssetWithVendorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: assetsScreenService,
    private toastr: ToastrService
  ) {}
  VendorForm = new UntypedFormControl();
  ngOnInit(): void {
    this.Codes$ = this.service.codes$;
  }
  save() {
    this.service
      .linkWithVendor({
        vendorId: this.VendorForm.value,
        assetId: this.data.ID,
        isManual: true,
      })
      .subscribe(
        (res: any) => {
          if (res.rv > 0) {

            this.dialogRef.close(res.VendorsAssets[0]);
          } else {

          }
        },
        (err) => {

        }
      );
  }
  Close() {
    this.dialogRef.close();
  }
}
