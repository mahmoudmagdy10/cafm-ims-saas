import { StoreCard } from './../../../../../stores/modals/spare-parts-card/spare-parts-card.component';
import { ToastrService } from 'ngx-toastr';
import { RequestSparePartComponent } from './../../../../../../shared/components/ruqest-forgin-service-or-spare-part/request-spare-part/request-spare-part.component';
import { MatDialog } from '@angular/material/dialog';
import { Component, Input, OnInit } from '@angular/core';
import { workOrderService } from 'src/app/pages/work-order/workOrder.service';
import { SparePartService } from 'src/app/pages/stores/spare-parts.service';
import { SparePartInWorkOrderTransfarListComponent } from './spare-part-in-work-order-transfar-list/spare-part-in-work-order-transfar-list.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-spare-part-in-work-order',
  templateUrl: './spare-part-in-work-order.component.html',
})
export class SparePartInWorkOrderComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    private service: workOrderService,
    private toastr: ToastrService,
    private _SparePartService: SparePartService
  ) {}
  @Input() dataEdit: any;
  @Input() preview: any;

  PartId: any;
  codes$:Observable<any>
  ngOnInit(): void {
    this.codes$ = this.service.Codes$
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

        this.service
          .linkpartWithWorkOrder(
            value.map((value) => {
              return {
                partId: value.partId,
                qty: value.quantity,
              };
            })
          )
          .subscribe(
            (res: any) => {
              if (res.rv > 0) {
                if (!this.dataEdit.WorkOrdersParts) {
                  this.dataEdit.WorkOrdersParts = [];
                }
                this.dataEdit.WorkOrdersParts = res.data;
              } else {
              }
            },
            (err) => {
            }
          );
      }
    });
  }
  deleteSparePart() {
    this.service
      .deleteSparePart({
        PartId: this.PartId?.PartId,
        uid: this.PartId?.UID,
      })
      .subscribe(
        (res: any) => {
          if (res) {
            this.dataEdit.WorkOrdersParts.forEach(
              (element: any, index: any) => {
                if (element.UID == this.PartId?.UID) {
                  this.dataEdit.WorkOrdersParts.splice(index, 1);
                }
              }
            );
          } else {
          }
        },
        (err) => {}
      );
  }
  SparePartCard(ID: any) {
    this._SparePartService.getItemEdit(ID);
    this._SparePartService.getTransactions();
    this._SparePartService.getCodes();
    const dialogRef = this.dialog
      .open(StoreCard, {
        width: '80vw',
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');
  }
  showWorkOrderPartTransList(item: any) {
    const dialogRef = this.dialog
      .open(SparePartInWorkOrderTransfarListComponent, {
        width: '20vw',
        disableClose: true,
        data: item,
      })
      .addPanelClass('cmms-custom-modal');
  }
}
