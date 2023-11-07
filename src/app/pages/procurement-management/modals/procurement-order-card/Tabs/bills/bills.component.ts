import { ToastrService } from 'ngx-toastr';
import { ProcurementManagementService } from 'src/app/pages/procurement-management/procurement-management.service';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddReceipt } from '../../modals/add-receipt/add-receipt.component';

@Component({
  selector: 'app-bills',
  templateUrl: './bills.component.html',
})
export class BillsComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    private service: ProcurementManagementService,
    private toastr: ToastrService
  ) {}
  bill$: Observable<any>;
  Codes$: Observable<any>;
  cur: string = localStorage.getItem('currencyName')!;

  ngOnInit(): void {
    this.bill$ = this.service.bill$;
    this.Codes$ = this.service.Codes$;
  }
  AddReceipt(data?: any) {
    const dialogRef = this.dialog
      .open(AddReceipt, {
        width: '60vw',
        data: data,
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');
  }
  deleteOrderBill(ID: any) {
    this.service.deleteOrderBill(ID).subscribe(
      (res: any) => {
        if (res.rv > 0) {
          this.service.getBill();
        } else {
        }
      },
      (err) => {}
    );
  }
}
