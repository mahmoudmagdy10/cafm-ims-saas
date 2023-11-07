import { switchMap } from 'rxjs/operators';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { SparePartService } from 'src/app/pages/stores/spare-parts.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { CommonService } from 'src/app/modules/auth/services/common.service';
import { VendorsService } from 'src/app/pages/vendors/vendors.service';

@Component({
  selector: 'link-with-spare-part',
  templateUrl: './link-with-spare-part.component.html',
})
export class LinkWithSparePartComponent implements OnInit {
  Codes$: Observable<any>;
  PartName = new UntypedFormControl();
  SearchOfParts$: Observable<any>;
  VendorForm = new UntypedFormGroup({
    PartID: new UntypedFormControl(),
    vendorPartNumber: new UntypedFormControl(),
    vendorPrice: new UntypedFormControl(),
    PartName: new UntypedFormControl(),
  });
  constructor(
    public dialogRef: MatDialogRef<LinkWithSparePartComponent>,
    @Inject(MAT_DIALOG_DATA) public Params: any,
    private service: VendorsService,
    private commanService: CommonService
  ) {}

  ngOnInit(): void {
    this.Codes$ = this.service.Codes$;
    this.OnSearch();
  }
  Close() {
    this.dialogRef.close();
  }
  OnSearch() {
    this.SearchOfParts$ = this.PartName.valueChanges.pipe(
      switchMap((value: string) => {
        return value ? this.commanService.search('Parts', value) : of([]);
      })
    );
  }
  onSelectPart(item: any) {
    this.VendorForm.get('PartID')?.setValue(item.Id);
    this.VendorForm.get('PartName')?.setValue(item.Name);



  }
  save() {
    this.dialogRef.close(this.VendorForm.value);
  }
}
