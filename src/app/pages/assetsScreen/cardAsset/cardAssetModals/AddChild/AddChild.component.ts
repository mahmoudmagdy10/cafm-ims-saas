import { UntypedFormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { assetsScreenService } from '../../../assetsScreen.service';
@Component({
  selector: 'add-child',
  templateUrl: 'AddChild.component.html',
})
export class AddChildComponent implements OnInit {
  DataAssets: any;
  Child = new UntypedFormControl();
  constructor(
    public dialogRef: MatDialogRef<AddChildComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: assetsScreenService,
    private toastr: ToastrService
  ) {}
  ngOnInit(): void {
    this.DataAssets = this.data.code.ParentId;
  }
  changePerant() {
    this.service
      .changeParent({
        AssetId: this.Child.value,
        ParentId: this.data.dataEdit.ID,
      })
      .subscribe(
        (res: any) => {
          if (res.rv > 0) {

            this.dialogRef.close();
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
