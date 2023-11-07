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
import { AddBond } from './add-bond/add-bond.component';
import { SparePartService } from '../../spare-parts.service';

@Component({
  selector: 'inventory-and-settlement-bonds',
  templateUrl: 'inventory-and-settlement-bonds.component.html',
})
export class InventoryAndSettlementBonds implements OnInit {
  listFieldsFilter: any[] = [];
  formFilter: UntypedFormGroup;
  codes$: Observable<any>;
  AssetSelected: any;
  Adjustment$: Observable<any>;
  idDeleted: any;
  constructor(
    public dialogRef: MatDialogRef<InventoryAndSettlementBonds>,
    private fb: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) public filter: any,
    public dialog: MatDialog,
    private service: SparePartService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.Adjustment$ = this.service.PartAdjustments$;
    this.codes$ = this.service.Codes$;

  }

  AddBond(data?: any) {
    const dialogRef = this.dialog
      .open(AddBond, {
        width: '70vw',
        data: data,
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');
  }
  PartAdjustmentsComplete(ID: any) {
    this.service.PartAdjustmentsComplete(ID).subscribe(
      (res: any) => {
        if (res.rv > 0) {

          this.service.getPartAdjustments();
          this.service.getSpareParts();
        } else {

        }
      },
      (err) => {


      }
    );
  }
  deleteAdjustment() {
    this.service.deleteAdjustment(this.idDeleted).subscribe(
      (res: any) => {
        if (res.rv > 0) {

          this.service.getPartAdjustments();
          this.service.getSpareParts();
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
