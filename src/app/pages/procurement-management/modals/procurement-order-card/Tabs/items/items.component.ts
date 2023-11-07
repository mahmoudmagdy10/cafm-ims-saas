import { tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProcurementManagementService } from 'src/app/pages/procurement-management/procurement-management.service';
import { RequestForeignServiceComponent } from 'src/app/shared/components/ruqest-forgin-service-or-spare-part/request-foreign-service/request-foreign-service.component';
import { RequestSparePartComponent } from 'src/app/shared/components/ruqest-forgin-service-or-spare-part/request-spare-part/request-spare-part.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
})
export class ItemsComponent implements OnInit {
  orderEdit$: Observable<any>;
  orderEdit: any;
  constructor(
    public dialog: MatDialog,
    private service: ProcurementManagementService,
    private toastr: ToastrService
  ) {}
  TotalTotal: number = 0;
  Totaldiscount: number = 0;
  TotalTaxcount: number = 0;
  TotalShippingCost: number = 0;
  items: any[] = [];
  cur: string = localStorage.getItem('currencyName')!;
  Codes$: Observable<any>;

  ngOnInit(): void {
    this.Codes$ = this.service.Codes$;

    this.orderEdit$ = this.service.OrderEdit$.pipe(
      tap((value: any) => {
        if (value) {
          this.orderEdit = value;
          if (!value?.TotalNotWork) {
            this.totalAll();
          }
        }
      })
    );
  }

  AddFroginService(poId: any) {
    const dialogRef = this.dialog
      .open(RequestForeignServiceComponent, {
        width: '60vw',
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        this.AddItem([{ ...value, poId: poId, ItemType: 2 }]);
      }
    });
  }

  AddSparePart(poId: any) {
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
            poId: poId,
            ItemType: 1,
          };
        });
        if (!this.orderEdit.PurchaseOrdersItems) {
          this.orderEdit.PurchaseOrdersItems = [];
        }
        var sendReq: boolean = true;
        value.forEach((item) => {
          if (
            this.orderEdit.PurchaseOrdersItems.find(
              (value: any) => value.PartId == item.partId
            )
          ) {
            sendReq = false;
          }
        });
        if (sendReq) {
          this.AddItem(body);
        }
      }
    });
  }
  deleteItemInPart(ID: number) {
    this.service.deleteItemInPart(ID).subscribe(
      (res: any) => {
        if (res.rv > 0) {

          this.orderEdit.PurchaseOrdersItems.forEach(
            (element: any, index: any) => {
              if (element.ID == ID) {
                this.orderEdit.PurchaseOrdersItems.splice(index, 1);
              }
            }
          );
          this.service.updateOrderEdit({
            PurchaseOrdersItems: this.orderEdit.PurchaseOrdersItems,
          });
        } else {

        }
      },
      (err) => {

      }
    );
  }
  addItem(items: any) {
    if (!this.orderEdit.PurchaseOrdersItems) {
      this.orderEdit.PurchaseOrdersItems = [];
    }
    this.orderEdit.PurchaseOrdersItems = [
      ...this.orderEdit.PurchaseOrdersItems,
      ...items,
    ];
    this.service.updateOrderEdit({
      PurchaseOrdersItems: this.orderEdit.PurchaseOrdersItems,
    });
  }
  onEdit(body: any, index: number) {
    const arr = [body];
    this.AddItem(arr, true);
    this.totalAll();
  }
  totalAll() {
    this.Totaldiscount = 0;
    this.TotalTaxcount = 0;
    this.TotalTotal = 0;
    this.TotalShippingCost = 0;
    if (this.orderEdit.PurchaseOrdersItems) {
      this.orderEdit.PurchaseOrdersItems.forEach((element: any) => {
        this.Totaldiscount =
          this.Totaldiscount +
          (element.DiscountRatio / 100) * element.ItemPrice * element.Quantity;
      });
      this.orderEdit.PurchaseOrdersItems.forEach((element: any) => {
        this.TotalTaxcount =
          this.TotalTaxcount +
          (element.TaxRatio / 100) * element.ItemPrice * element.Quantity;
      });
      this.orderEdit.PurchaseOrdersItems.forEach((element: any, i: any) => {
        this.TotalTotal =
          this.TotalTotal + element.Quantity * element.ItemPrice;
      });
      this.orderEdit.PurchaseOrdersItems.forEach((element: any, i: any) => {
        this.TotalShippingCost =
          +this.TotalShippingCost + +element.ShippingCost;
      });
    }
    this.service.updateOrderEdit({
      TotalAmount:
        this.TotalTaxcount +
        this.TotalTotal +
        +this.TotalShippingCost -
        this.Totaldiscount,
      TotalNotWork: true,
    });
  }
  total(item: any) {
    const x = item.Quantity * item.ItemPrice;
    return (
      x +
      (x * item.TaxRatio) / 100 -
      (x * item.DiscountRatio) / 100 +
      parseInt(item.ShippingCost)
    );
  }

  AddItem(body: any, isEdit?: boolean) {
    this.service.addItemInPart(body).subscribe(
      (res: any) => {
        if (res.rv > 0) {
          if (!isEdit) {
            this.addItem(res.data);
          }

        } else {

        }
      },
      (err) => {

      }
    );
  }
}
