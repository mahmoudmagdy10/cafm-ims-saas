import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormControl, FormGroup } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { workOrderService } from '../../../../../workOrder.service';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'edit-instruction',
  templateUrl: './addInstruction.component.html',
  styleUrls: ['./addInstruction.component.scss'],
})
export class AddInstructionComponent implements OnInit {
  Codes$: Observable<any>;

  constructor(
    public dialogRef: MatDialogRef<AddInstructionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public fb: UntypedFormBuilder,
        private service: workOrderService,

    public dialog: MatDialog,
    private toastr: ToastrService
  ) {}
  fieldTypeSelected: number;
  nameField = new UntypedFormControl();
  ngOnInit(): void {
    this.Codes$ = this.service.Codes$;
  }
  checkFieldType(fieldTypeSelected: number) {
    this.fieldTypeSelected = fieldTypeSelected;
  }
  Close() {
    this.dialogRef.close();
  }
  onSave() {
    if (
      (this.fieldTypeSelected || this.data.isOption) &&
      this.nameField.value
    ) {
      this.service
        .addInStruction({
          locationId: localStorage.getItem('defaultLocation'),
          name: this.nameField.value,
          fieldTypeId: this.data.isOption ? 10 : this.fieldTypeSelected,
          parentId: this.data.ID || null,
        })
        .subscribe(
          (res: any) => {
            if (res.rv > 0) {

              this.dialogRef.close(res.data[0]);
            } else {

            }
          },
          (err) => {

          }
        );
    } else {
      this.toastr.error(document.dir=='rtl'?'يرجى ادخال الحقول المطلوبة':'Enter All Field Required');
    }
  }
}
