import { workOrderService } from 'src/app/pages/work-order/workOrder.service';
import { Component, Inject, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { RequestForeignServiceComponent } from 'src/app/shared/components/ruqest-forgin-service-or-spare-part/request-foreign-service/request-foreign-service.component';
import { RequestSparePartComponent } from 'src/app/shared/components/ruqest-forgin-service-or-spare-part/request-spare-part/request-spare-part.component';

@Component({
  selector: 'app-add-purchase-order',
  templateUrl: './add-purchase-order.component.html',
})
export class AddPurchaseOrderComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<AddPurchaseOrderComponent>,
    private toastr: ToastrService,
    private service: workOrderService,
    public dialog: MatDialog,

    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}

  partsOrService: any[] = [];
  Discription: string = '';
  AddFroginService() {
    const dialogRef = this.dialog
      .open(RequestForeignServiceComponent, {
        width: '60vw',
        disableClose: true,

      })
      .addPanelClass('cmms-custom-modal');
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {

        this.partsOrService.push({ ...value, ItemType: 2 });
      }
    });
  }

  AddSparePart() {
    const dialogRef = this.dialog
      .open(RequestSparePartComponent, {
        width: '60vw',
        disableClose: true,

      })
      .addPanelClass('cmms-custom-modal');
    dialogRef.afterClosed().subscribe((value: any[]) => {
      if (value) {
        const body = value.map((value) => {
          return {
            ...value,
            ItemType: 1,
          };
        });
        this.partsOrService = [...this.partsOrService, ...body];
      }
    });
  }
  onSave() {
    this.service
      .linkWithPurchaseOrder(this.Discription, this.partsOrService)
      .subscribe(
        (res: any) => {
          if (res) {

            this.dialogRef.close(res.data);
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
