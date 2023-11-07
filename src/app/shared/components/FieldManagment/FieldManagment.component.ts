import { UntypedFormControl } from '@angular/forms';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { FieldManagmentService } from './FieldManagment.service';
import { CategoriesManagmentAccidentComponent } from './categories-managment/categories-managment.component';
import { addFieldsAccidentComponent } from './addField/addFields.component';
import { SelectParentFieldComponent } from './select-parent-field/select-parent-field.component';

@Component({
  selector: 'field-managment',
  templateUrl: './FieldManagment.component.html',
  styleUrls: ['./FielsManagment.component.scss'],
})
export class FieldManagmentComponent implements OnInit {
  code: any;
  dataSubscription: Subscription;
  IDFieldDeleted: number;
  DataFieldManagment$: Observable<any>;
  searchedKeyword = new UntypedFormControl();
  pagePermissionSubscription: Subscription;
  CodeObz$: Observable<any>;
  constructor(
    public service: FieldManagmentService,
    private toster: ToastrService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<FieldManagmentComponent>
  ) {}

  ngOnInit() {
    this.CodeObz$ = this.service.CodeObz$;
  }
  get ComponentType() {
    return this.service.ComponentType;
  }
  CategoriesManagment() {
    const dialogRef = this.dialog.open(CategoriesManagmentAccidentComponent, {
      width: '60vw',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((event) => {
      this.service.getFeild();
    });
  }
  managmentFields(id: any) {
    const dialogRef = this.dialog.open(addFieldsAccidentComponent, {
      width: '60vw',
      data: { id: id },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((event) => {
      if (event == 'Close&refrech') {
        this.service.getFeild();
      } else {
      }
    });
  }
  Close() {
    this.dialogRef.close();
  }

  onDelete() {
    this.service
      .deleteCommonFeild({ ID: this.IDFieldDeleted })
      .subscribe((res: any) => {
        if (res.rv > 0) {
          this.service.getFeild();

        } else {
          this.toster.error(res.Msg);
        }
      });
  }
  openAddFields() {
    this.managmentFields(0);
  }

  onEdit(id: any) {
    this.managmentFields(id);
  }
  addParentToChild(item: any){
    const dialogRef = this.dialog.open(SelectParentFieldComponent, {
      width: '50vw',
      disableClose: true,
      data: {
        field: item
      }
    });
  }
}
