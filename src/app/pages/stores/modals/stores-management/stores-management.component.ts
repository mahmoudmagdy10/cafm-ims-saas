import { SparePartService } from './../../spare-parts.service';
import {
  UntypedFormGroup,
  FormControl,
  Validators,
  UntypedFormBuilder,
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
import { AddStore } from './add-store/add-store.component';

@Component({
  selector: 'stores-management',
  templateUrl: 'stores-management.component.html',
})
export class StoresManagement implements OnInit {
  listFieldsFilter: any[] = [];
  formFilter: UntypedFormGroup;
  AssetSelected: any;
  stores$: Observable<any>;
  codes$: Observable<any>;
  constructor(
    public dialogRef: MatDialogRef<StoresManagement>,
    private fb: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) public filter: any,
    public dialog: MatDialog,
    private service: SparePartService,
    private toastr: ToastrService
  ) {}
  idStoreDeleted: any;
  ngOnInit(): void {
    this.stores$ = this.service.Stores$;
    this.codes$ = this.service.Codes$;
  }

  addStore() {
    const dialogRef = this.dialog
      .open(AddStore, {
        minWidth: '25vw',
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');
  }
  editStore(item: any) {
    const dialogRef = this.dialog
      .open(AddStore, {
        minWidth: '25vw',
        data: item,
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');
  }
  deleteStore() {
    this.service.deleteStore(this.idStoreDeleted).subscribe(
      (res: any) => {
        if (res.rv > 0) {

          this.service.getStores();
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
