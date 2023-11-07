import { addPMTask } from './../../../../pms/modals/addPMTask/addPMTask.component';
import { PmsService } from 'src/app/pages/pms/pms.service';
import { ProcurementManagementService } from 'src/app/pages/procurement-management/procurement-management.service';
import { PMcard } from './../../../../pms/modals/pm-card/pm-card.component';
import { Observable } from 'rxjs';
import { Component, Input, OnInit, Output, ViewChild } from '@angular/core';
import { assetsScreenService } from '../../../assetsScreen.service';
import { MatDialog } from '@angular/material/dialog';
import { confirmDeleteComponent } from 'src/app/shared/confirmDelete/confirmDelete.component';

@Component({
  selector: 'protective-tasks',
  templateUrl: 'protectiveTasks.component.html',
})
export class protectiveTasksComponent implements OnInit {
  @Input() data: any;
  @ViewChild('confirmdeleteWorkOrder')
  confirmdeleteWorkOrder: confirmDeleteComponent;
  constructor(
    private assetsService: assetsScreenService,
    public dialog: MatDialog,
    private PmsService: PmsService
  ) {}
  DataPmsForAsset$: Observable<any>;
  ngOnInit(): void {
    this.DataPmsForAsset$ = this.assetsService.DataPmsForAsset$;
    this.PmsService.getCodePms();
  }
  ArrayToString(data: any) {
    if (data) {
      return data
        .map((value: any) => {
          return value.Name;
        })
        .join(' , ');
    }
  }
  Card(ID: any) {
    this.PmsService.getSchedulesTimeByPMSID(ID);

    const dialogRef = this.dialog
      .open(PMcard, {
        width: '70vw',
        data: { ID: ID },
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');
    dialogRef.afterClosed().subscribe((addNew) => {
      this.assetsService.getAllPmsFprAsset(this.data.ID);
    });
  }

  AddPM() {
    const dialogRef = this.dialog
      .open(addPMTask, {
        width: '60vw',
        data: { AssetData: this.data },
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        this.assetsService.getAllPmsFprAsset(this.data.ID);
        // this.getDataPms();
      }
    });
  }
  confirmDuplicateAsset() {
    this.confirmdeleteWorkOrder.openModal();
  }

  DuplicateAsset() {
    this.assetsService.DuplicateAsset(this.data.ID).subscribe((rv) => {});
  }
}
