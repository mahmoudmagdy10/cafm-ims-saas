import { ToastrService } from 'ngx-toastr';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { SparePartService } from './../../spare-parts.service';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-spare-parts',
  templateUrl: './add-spare-parts.component.html',
})
export class AddSparePartsComponent implements OnInit {
  codes$: Observable<any>;
  addSparePartForm = new UntypedFormGroup({
    PartName: new UntypedFormControl('', Validators.required),
    PartNumber: new UntypedFormControl('', Validators.required),
    categoryId: new UntypedFormControl('', Validators.required),
  });
  constructor(
    public dialogRef: MatDialogRef<AddSparePartsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private service: SparePartService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.codes$ = this.service.Codes$;
  }
  addSparePart() {
    if(this.addSparePartForm.valid){
       this.service.addSpareParts(this.addSparePartForm.value).subscribe(
      (res: any) => {
        if (res.rv > 0) {

          this.service.getSpareParts();
          this.dialogRef.close('onSave');
        } else {

        }
      },
      (err) => {

      }
    );
    }else{
      this.toastr.error(document.dir=='rtl'?'يرجى ادخال الحقول المطلوبة':'Enter All Field Required');
    }

  }
  Close() {
    this.dialogRef.close();
  }
}
