import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MaintenanceRequestsService } from './../../../maintenance-requests.service';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { AddImageworkRequestComponent } from './add-image-workRequest/add-image-workRequest.component';
import { TreeAssetsComponent } from 'src/app/shared/components/Tree/tree-assets/tree-assets.component';

@Component({
  selector: 'app-gate-design',
  templateUrl: './gate-design.component.html',
  styleUrls: ['./gate-design.component.scss'],
})
export class GateDesignComponent implements OnInit {
  @Input() data: any;
  isChange: boolean = false;
  @Output() EditWorkRequest = new EventEmitter();
  ImageCorpped: any;
  Codes$: Observable<any>;
  Avatar=environment.Avatar

  constructor(
    private service: MaintenanceRequestsService,
    public dialog: MatDialog
  ) {
    this.Codes$ = this.service.Code$;
  }

  AddImage() {
    const dialogRef = this.dialog
      .open(AddImageworkRequestComponent, {
        width: '60vw',
        data: { ID: this.data.ID },
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');

    dialogRef.afterClosed().subscribe((result) => {


      if (result) {
        this.data.Logo = result.data[0].FilePath;
      }
    });
  }
  opentree() {
    const dialogRef = this.dialog.open(TreeAssetsComponent, {
      width: '50vw',
      disableClose: true,
      // data: { data: this.code.ParentId, assetInfo: this.assetInfo || null },
    });
  }
  ngOnInit(): void {}
}
