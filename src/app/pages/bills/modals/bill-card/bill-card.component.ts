import { confirmDeleteComponent } from 'src/app/shared/confirmDelete/confirmDelete.component';
import { jsPDF } from 'jspdf';
import { tap, map } from 'rxjs/operators';

import { ToastrService } from 'ngx-toastr';
import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Observable } from 'rxjs';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { BillsService } from '../../bills.service';
import { ProcurementManagementService } from 'src/app/pages/procurement-management/procurement-management.service';
import { procurementOrderCard } from 'src/app/pages/procurement-management/modals/procurement-order-card/procurement-order-card.component';
import html2canvas from 'html2canvas';

@Component({
  selector: 'bill-card',
  templateUrl: 'bill-card.component.html',
})
export class BillCard implements OnInit {
  billById$: Observable<any>;
  originalDate: any;
  cur: string = localStorage.getItem('currencyName')!;
  @ViewChild('confirmdeleteBill')
  confirmdeleteBill: confirmDeleteComponent;
  constructor(
    public dialogRef: MatDialogRef<BillCard>,
    @Inject(MAT_DIALOG_DATA) public filter: any,
    public dialog: MatDialog,
    private service: BillsService,
    private serviceOrder: ProcurementManagementService,
    private toastr: ToastrService
  ) {}
  orderEdit: any;
  BillEdit: any;
  TotalTotal: number = 0;
  Totaldiscount: number = 0;
  TotalTaxcount: number = 0;
  TotalShippingCost: number = 0;
  Codes$: Observable<any>;
  ngOnInit(): void {
    this.Codes$ = this.serviceOrder.Codes$;

    this.billById$ = this.service.billById$.pipe(
      map((value) => (value ? value[0] : false)),
      tap((value: any) => {
        this.originalDate = new Date(value.BillDate);
        if (value) {
          this.orderEdit = value.PurchaseOrders[0];
          this.BillEdit = value;
          this.totalAll();
        }
      })
    );
  }
  procurementOrderCard(ID: any) {
    this.serviceOrder.POId = ID;
    this.serviceOrder.getCodes();
    this.serviceOrder.getOrderEdit();
    this.serviceOrder.getBill();
    const dialogRef = this.dialog
      .open(procurementOrderCard, {
        width: '80vw',
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');
  }
  total(index: number, item: any) {
    const x = item.Quantity * item.ItemPrice;
    return (
      x +
      (x * item.TaxRatio) / 100 -
      (x * item.DiscountRatio) / 100 +
      parseInt(item.ShippingCost)
    );
  }
  totalAll() {
    this.Totaldiscount = 0;
    this.TotalTaxcount = 0;
    this.TotalTotal = 0;
    this.TotalShippingCost = 0;
    if (this.orderEdit.PurchaseOrdersBillsItems) {
      this.orderEdit.PurchaseOrdersBillsItems.forEach((element: any) => {
        this.Totaldiscount =
          this.Totaldiscount +
          (element.DiscountRatio / 100) * element.ItemPrice * element.Quantity;
      });
      this.orderEdit.PurchaseOrdersBillsItems.forEach((element: any) => {
        this.TotalTaxcount =
          this.TotalTaxcount +
          (element.TaxRatio / 100) * element.ItemPrice * element.Quantity;
      });
      this.orderEdit.PurchaseOrdersBillsItems.forEach(
        (element: any, i: any) => {
          this.TotalTotal =
            this.TotalTotal + element.Quantity * element.ItemPrice;
        }
      );
      this.orderEdit.PurchaseOrdersBillsItems.forEach(
        (element: any, i: any) => {
          this.TotalShippingCost =
            +this.TotalShippingCost + +element.ShippingCost;
        }
      );
    }
  }
  updateBillMessg() {
    this.confirmdeleteBill.openModal();
  }
  updateBill() {
    this.service
      .addBill({
        ID: this.BillEdit.ID,
        PoId: this.BillEdit.POId,
        BillDate: this.BillEdit.BillDate,
        BillAssignmentId: this.BillEdit.BillAssignmentId,
        BillStatusId: 1,
        purchaseOrdersBillsItems: this.orderEdit.PurchaseOrdersBillsItems.map(
          (value: any) => {
            return {
              id: value.BillsItemId,
              itemId: value.ItemId,
              billId: value.BillId,
              receivedQuantity: value.ReceivedQuantity,
              Quantity: value.Quantity,
              ServiceName: value.ItemName,
              Type: value.ItemType,
              PartName: value.ItemName,
            };
          }
        ),
      })
      .subscribe(
        (res: any) => {
          if (res.rv > 0) {
            this.service.getBill();

            this.dialogRef.close();
          } else {
          }
        },
        (err) => {}
      );
  }
  Close() {
    this.dialogRef.close();
  }
  @ViewChild('Report') Report!: ElementRef<HTMLImageElement>;

  exportPDF() {
    html2canvas(this.Report.nativeElement).then((canvas) => {
      const imgData = canvas.toDataURL('image/jpeg');

      const pdf = new jsPDF({
        orientation: 'portrait',
      });

      const imageProps = pdf.getImageProperties(imgData);

      const pdfw = pdf.internal.pageSize.getWidth();

      const pdfh = (imageProps.height * pdfw) / imageProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfw, pdfh);

      pdf.save('output.pdf');
    });
  }
}
