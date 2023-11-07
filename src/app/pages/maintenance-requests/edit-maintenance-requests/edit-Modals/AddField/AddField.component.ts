import { MaintenanceRequestsService } from './../../../maintenance-requests.service';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { UntypedFormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
@Component({
  selector: 'add-feild',
  templateUrl: 'AddField.component.html',
})
export class AddFieldComponentInWorkRequests implements OnInit {
  DataFeild$: Observable<any>;
  constructor(
    public dialogRef: MatDialogRef<AddFieldComponentInWorkRequests>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public service: MaintenanceRequestsService,
    private toastr: ToastrService
  ) {}
  searchField = new UntypedFormControl();
  ArrayFieldsId: any[] = [];
  disabled: boolean = false;
  ngOnInit(): void {
    this.DataFeild$ = this.service.DataFeild$.pipe(
      map((value: any) => {

        value = value.map((itemField: any) => {
          if (
            this.data.fieldsSelected &&
            this.data.fieldsSelected.find(
              (item: any) => item.FieldId == itemField.ID
            ) != null
          ) {
            return { ...itemField, checked: true, showField: false };
          } else {
            return { ...itemField, checked: false, showField: false };
          }
        });
        this.disabled = true;
        return value;
      })
    );
  }

  checkField(event: any, item: any) {
    if (event.target.checked == true) {
      this.ArrayFieldsId.push({
        fieldId: item.ID,
        value: '',
      });
    } else {
      this.ArrayFieldsId.forEach((value: any, index: any) => {
        if (value.fieldId == item.ID) {
          this.ArrayFieldsId.splice(index, 1);
        }
      });
    }

  }
  onSave() {

    const body = {
      ComponentId: this.data.idWorkRequestGates,
      fieldsData: this.ArrayFieldsId,
    };
    this.service.addFieldWorkRequestGates(body).subscribe(
      (res: any) => {
        if (res.rv > 0) {

          res.AssetsFields[0];
          this.dialogRef.close(res.AssetsFields[0]);
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
