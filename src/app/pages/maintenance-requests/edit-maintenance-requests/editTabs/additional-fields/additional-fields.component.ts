import { AddFieldComponentInWorkRequests } from './../../edit-Modals/AddField/AddField.component';
import { BehaviorSubject, Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MaintenanceRequestsService } from './../../../maintenance-requests.service';
import { MatDialog } from '@angular/material/dialog';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-additional-fields',
  templateUrl: './additional-fields.component.html',
  styleUrls: ['./additional-fields.component.scss'],
})
export class AdditionalFieldsComponent implements OnInit {
  @Input() data: any;
  FieldIdDeleted: number;
  LoadingField: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
Codes$:Observable<any>
  constructor(
    public dialog: MatDialog,
    public service: MaintenanceRequestsService,
    private toastr: ToastrService
  ) {
    this.Codes$ =this.service.Code$
  }

  ngOnInit(): void {
    if (!this.data.WorkRequestGatesFields) {
      this.data.WorkRequestGatesFields = [];
    }
  }
  addFeild() {
    const dialogRef = this.dialog.open(AddFieldComponentInWorkRequests, {
      width: '50vw',
      data: {
        idWorkRequestGates: this.data.ID,
        fieldsSelected: this.data.WorkRequestGatesFields,
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.data.WorkRequestGatesFields.push(result);
      }
    });
  }

  deleteFieldInAsset() {
    this.LoadingField.next(true);
    this.service
      .deleteFieldInWorkRequestGates({
        ComponentId: this.data.ID,
        FieldId: this.FieldIdDeleted,
      })
      .subscribe(
        (res: any) => {
          if (res.rv > 0) {
            this.data.WorkRequestGatesFields.forEach(
              (value: any, index: any) => {
                if (value.FieldId == this.FieldIdDeleted) {
                  this.data.WorkRequestGatesFields.splice(index, 1);
                }
              }
            );

            this.LoadingField.next(false);
          } else {

            this.LoadingField.next(false);
          }
        },
        (err) => {
          this.toastr.error(err.Msg);
          this.LoadingField.next(false);
        }
      );
  }
  get loadingField$() {
    return this.LoadingField.asObservable();
  }
}
