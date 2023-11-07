import { SparePartService } from '../../../spare-parts.service';
import {
  UntypedFormGroup,
  UntypedFormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  Inject,
} from '@angular/core';
import { Observable } from 'rxjs';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

@Component({
  selector: 'add-store',
  templateUrl: 'add-store.component.html',
})
export class AddStore implements OnInit {
  addStoreForm = new UntypedFormGroup({
    ID: new UntypedFormControl(0),
    StoreName: new UntypedFormControl(),
    StoreLocation: new UntypedFormControl(),
  });

  constructor(
    public dialogRef: MatDialogRef<AddStore>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private service: SparePartService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    if (this.data) {
      this.addStoreForm.patchValue(this.data);
    }
  }
  addStore() {
    this.service.addStore(this.addStoreForm.value).subscribe(
      (res: any) => {
        if (res.rv > 0) {

          this.service.getStores();
          this.dialogRef.close('onSave');
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
