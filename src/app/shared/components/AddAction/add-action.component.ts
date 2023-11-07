import { ToastrService } from 'ngx-toastr';
import { assetsScreenService } from '../../../pages/assetsScreen/assetsScreen.service';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { AddActionService } from './add-action.service';

@Component({
  selector: 'Add-action',
  templateUrl: 'add-action.component.html',
  styleUrls: ['./add-action.component.scss'],
})
export class AddActionComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<AddActionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastr: ToastrService,
    private service: AddActionService
  ) {}

  form = new UntypedFormGroup({
    LogDate: new UntypedFormControl(),
    IsShown: new UntypedFormControl(true),
    LogDetails: new UntypedFormControl(),
    Value: new UntypedFormControl(),
  });
  ngOnInit(): void {
  }
  onSave() {
    const today = new Date();
    // Create a new Date object for the date you want to compare
    const logDate = new Date(this.form.get('LogDate')?.value);

    const body = {
      ComponentId: this.data.ID,
      ...this.form.value,
      IsShown: this.form.get('IsShown')?.value
      ? this.form.get('IsShown')?.value
      : false,
      ComponentType: this.data.ComponentType,
    };

    // Compare the date objects using the getTime() method
    if(this.form.get('LogDetails')?.value){
      if(logDate.getTime() > today.getTime()){
        this.service.saveOrEditHistoryActions(body).subscribe(
          (res: any) => {
            if (res?.rv > 0) {
              this.dialogRef.close(res.output[0]);
            } else {
            }
          },
          (err) => {
            this.toastr.error(err.message);
          }
        );
      }else{
        this.toastr.error(localStorage.getItem('language') === 'en' ? 'The date is less than today.' : 'التاريخ والوقت المدخل أقل من تاريخ ووقت اليوم');
      }
    }

  }
  onUpload(event: any) {
    var uploadedFiles: any[] = [];
    for (let file of event.files) {
      uploadedFiles.push(file);
    }
    this.form.get('Value')?.setValue(uploadedFiles);
  }
  Close() {
    this.dialogRef.close();
  }
}
