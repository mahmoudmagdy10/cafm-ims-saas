import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { MaintenanceRequestsService } from './maintenance-requests.service';
import { CopySettingComponent } from './copy-setting/copy-setting.component';
import { QrCodeComponent } from './qr-code/qr-code.component';
import { EditMaintenanceRequestsComponent } from './edit-maintenance-requests/edit-maintenance-requests.component';
import { MatDialog } from '@angular/material/dialog';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FieldManagmentComponent } from 'src/app/shared/components/FieldManagment/FieldManagment.component';
import { FieldManagmentService } from 'src/app/shared/components/FieldManagment/FieldManagment.service';
import { ViewItemInFieldService } from 'src/app/shared/components/ViewFieldInItem/view-field-in-item.service';
import { tap } from 'rxjs/operators';
import { ExportTOExcelShared } from 'src/app/shared/ExportTableToExcel';

@Component({
  selector: 'app-maintenance-requests',
  templateUrl: './maintenance-requests.component.html',
  styleUrls: ['./maintenance-requests.component.scss'],
})
export class MaintenanceRequestsComponent implements OnInit {
  WorkRequestGates$: Observable<any>;
  Code$: Observable<any>;
  Excel$: Observable<any>;
  constructor(
    public dialog: MatDialog,
    private service: MaintenanceRequestsService,
    private toastr: ToastrService,
    public fieldManagmentService: FieldManagmentService,
    private addFieldService: ViewItemInFieldService
  ) {}

  ngOnInit(): void {
    this.getWorkRequestGates();
    this.getCode();WorkRequestGatesCommonFieldsEdit
    :
    true
    WorkRequestGatesEdit
    :
    true
    WorkRequestGatesLock
    :
    true
    this.getField();
    this.Code$ = this.service.Code$;
    this.fieldManagmentService.ComponentType = 'WorkRequestGates';
    this.addFieldService.ComponentType = 'WorkRequestGates';
    this.fieldManagmentService.getFeild();
  }
  getWorkRequestGates() {
    this.service.getWorkRequestGates();
    this.WorkRequestGates$ = this.service.WorkRequestGates$;
  }
  getCode() {
    this.service.getCodeWorkRequestGates();
  }
  getField() {
    this.service.getFeild();
  }
  openEdit(item: any) {
    const dialogRef = this.dialog
      .open(EditMaintenanceRequestsComponent, {
        width: '60vw',
        data: item,
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');

    dialogRef.afterClosed().subscribe((result) => {

    });
  }
  openQRCode(url: any) {
    const dialogRef = this.dialog
      .open(QrCodeComponent, {
        width: '60vw',
        data: url,
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');

    dialogRef.afterClosed().subscribe((result) => {

    });
  }
  CopySetting(item: any) {
    const dialogRef = this.dialog
      .open(CopySettingComponent, {
        width: '60vw',
        data: {
          ID: item.ID,
          LocationId: item.LocationId,
          LocationName: item.LocationName,
        },
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');

    dialogRef.afterClosed().subscribe((result) => {

    });
  }

  changeStates(item: any) {
    const body = {
      ID: item.ID,
      IsActive: !item.IsActive,
    };
    this.service.changeStates(body).subscribe(
      (res: any) => {
        if (res.rv > 0) {

        } else {

        }
      },
      (err) => {

      }
    );
  }
  managmentFields() {
    const dialogRef = this.dialog
      .open(FieldManagmentComponent, {
        width: '60vw',
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');

    dialogRef.afterClosed().subscribe((result) => {

    });
  }
  convertURl(ID: any) {
    const url: string = window.location.href;
    const host: string =
      url.split('/')[0] +
      '/' +
      url.split('/')[1] +
      '/' +
      url.split('/')[2] +
      '/' +
      `public/MaintenanceRequest/${ID}`;
    return host;
  }
  newTab(url: any) {
    window.open(url, '_blank');
  }
  @ViewChild('TABLE') table: ElementRef;
  export() {
    this.Excel$ = this.service.getDataForExcel().pipe(
      tap((value) => {
        setTimeout(() => {
          ExportTOExcelShared(this.table.nativeElement);
        }, 300);
      })
    );
  }
}
