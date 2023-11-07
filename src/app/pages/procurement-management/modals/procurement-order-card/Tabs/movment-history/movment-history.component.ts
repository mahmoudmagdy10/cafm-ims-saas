import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ProcurementManagementService } from 'src/app/pages/procurement-management/procurement-management.service';
import { AddActionComponent } from 'src/app/shared/components/AddAction/add-action.component';

@Component({
  selector: 'app-movment-history',
  templateUrl: './movment-history.component.html',
})
export class MovmentHistoryComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    private service: ProcurementManagementService
  ) {}
  orderEdit$: Observable<any>;

  ngOnInit(): void {
    this.orderEdit$ = this.service.OrderEdit$;
  }
  addAction(data: any) {
    const dialogRef = this.dialog.open(AddActionComponent, {
      width: '70vw',
      data: { ID: data.ID, ComponentType: 'Procurement' },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // data.PurchaseOrdersItems = [
        //   ...this.orderEdit.PurchaseOrdersItems,
        //   ...items,
        // ];
        // this.service.updateOrderEdit({
        //   PurchaseOrdersItems: this.orderEdit.PurchaseOrdersItems,
        // });
      }
    });
  }
}
