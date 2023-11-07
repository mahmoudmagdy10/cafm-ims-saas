import { ToastrService } from 'ngx-toastr';
import { workOrderService } from '../../../../workOrder.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  OnDestroy,
} from '@angular/core';
import { concat, merge, Observable, Subscription } from 'rxjs';
import { retry, skip, switchMap } from 'rxjs/operators';
import { TreeAssetsComponent } from 'src/app/shared/components/Tree/tree-assets/tree-assets.component';
import { MatDialog } from '@angular/material/dialog';
import { UserAndTeamsModal } from 'src/app/shared/modalsShared/User&TeamsModal/User&TeamsModal.component';
import { AddPurchaseOrderComponent } from '../../modalsCard/add-purchase-order/add-purchase-order.component';

@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.scss'],
})
export class PurchaseOrderComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    private toastr: ToastrService,
    private service: workOrderService
  ) {}
  @Input() dataEdit: any;
  @Input() preview: any;

  ngOnInit(): void {}

  AddPurchaseOrder() {
    const dialogRef = this.dialog
      .open(AddPurchaseOrderComponent, {
        width: '60vw',
        data: {},
        disableClose: true,

      })
      .addPanelClass('cmms-custom-modal');
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        if (!this.dataEdit.PurchaseOrders) {
          this.dataEdit.PurchaseOrders = [];
        }
        this.dataEdit.PurchaseOrders = [
          ...this.dataEdit.PurchaseOrders,
          ...value,
        ];

      }
    });
  }
  deleteOrder(ID: any) {
    this.service.deleteOrder(ID).subscribe(
      (res: any) => {
        if (res) {

          this.dataEdit.PurchaseOrders.forEach((element: any, index: any) => {
            if (element.ID == ID) {
              this.dataEdit.PurchaseOrders.splice(index, 1);
            }
          });
        } else {

        }
      },
      (err) => {

      }
    );
  }
}
