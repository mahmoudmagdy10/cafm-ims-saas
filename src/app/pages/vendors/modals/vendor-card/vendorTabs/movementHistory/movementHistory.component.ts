import { ToastrService } from 'ngx-toastr';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddActionComponent } from 'src/app/shared/components/AddAction/add-action.component';
import { AddActionService } from 'src/app/shared/components/AddAction/add-action.service';
import { VendorsService } from 'src/app/pages/vendors/vendors.service';
import { Observable } from 'rxjs';
import { LogsByComponentTypeService } from 'src/app/shared/components/logs-by-component-type/logs-by-component-type.service';

@Component({
  selector: 'movement-history',
  templateUrl: 'movementHistory.component.html',
})
export class movementHistoryVendorComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    private service: AddActionService,
    private serviceVen: VendorsService,
    private toastr: ToastrService,
    private _logsByComponentTypeService: LogsByComponentTypeService
  ) {}
  @Input() data: any;
  Codes$: Observable<any>;
  ngOnInit(): void {
    this.Codes$ = this.serviceVen.getCodeObz$();
  }

  addAction() {
    const dialogRef = this.dialog.open(AddActionComponent, {
      width: '70vw',
      data: { ID: this.data.ID, ComponentType: 'Vendors' },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.data.VendorsLogs.push(result);
        this._logsByComponentTypeService.getLogsByComponentType('Vendors');
      }
    });
  }
  editShown(i: number) {
    this.data.VendorsLogs[i].IsShown = !this.data.VendorsLogs[i].IsShown;
    const body = {
      ...this.data.VendorsLogs[i],
      ComponentType: 'Vendors',
    };
    this.service.saveOrEditHistoryActions(body).subscribe(
      (res: any) => {
        if (res?.rv > 0) {
        } else {
        }
      },
      (err) => {
        this.toastr.error(err.message);
      }
    );
  }
}
