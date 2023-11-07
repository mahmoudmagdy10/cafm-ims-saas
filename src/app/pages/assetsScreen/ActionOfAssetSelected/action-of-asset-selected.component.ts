import { MoveSelectedComponent } from './move-selected/move-selected.component';
import { DeleteSelectedComponent } from './delete-selected/delete-selected.component';
import { assetsScreenService } from './../assetsScreen.service';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-action-of-asset-selected',
  templateUrl: './action-of-asset-selected.component.html',
})
export class ActionOfAssetSelectedComponent implements OnInit {
  @Output() refreshAssets: EventEmitter<any> = new EventEmitter();
  @Input() AssetsSelected: any;
  @Input() permissions: any;
  @Output() exportToExcelEmit: EventEmitter<any> = new EventEmitter();
  @Input() filters: any;
  items: any = [];
  constructor(
    public assetsService: assetsScreenService,
    public dialog: MatDialog,
    private _translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.assetsService.codes$.subscribe((value) => {
      if (value) {

        // if (value.PagePermissions?.AssetsImport)
        //   this.items.push({
        //     label: this._translateService.instant(
        //       'ASSETS.ACTIONSONSELECTEDMENU.IMPORTDATA'
        //     ),
        //     icon: 'fas fa-file-import fa-lg',
        //     command: () => {
        //     },
        //   });
        //   if (value.PagePermissions?.AssetsExport)
        // this.items.push({
        //   label: this._translateService.instant(
        //     'ASSETS.ACTIONSONSELECTEDMENU.EXPORTDATA'
        //   ),
        //   icon: 'fas fa-file-import fa-lg',
        //   command: () => {
        //     this.exportToExcel();
        //   },
        // });
        if (value.PagePermissions?.AssetsDelete)
        this.items.push({
          label: this._translateService.instant(
            'ASSETS.ACTIONSONSELECTEDMENU.DELETESELECTED'
          ),
          icon: 'fas fa-file-import fa-lg',
          command: () => {
            this.DeleteSelected();
          },
        });
        if (value.PagePermissions?.AssetsMove)
        this.items.push({
          label: this._translateService.instant(
            'ASSETS.ACTIONSONSELECTEDMENU.MOVESELECTED'
          ),
          icon: 'fa fa-trash fa-lg',
          command: () => {
            this.MoveSelected();
          },
        });
      }
    });
  }
  DeleteSelected() {
    const dialogRef = this.dialog
      .open(DeleteSelectedComponent, {
        width: '60vw',
        data: this.AssetsSelected,
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');

    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'Deleted') {
        this.AssetsSelected.length = 0;
        this.refreshAssets.emit();
      }
    });
  }
  MoveSelected() {
    const dialogRef = this.dialog
      .open(MoveSelectedComponent, {
        width: '60vw',
        data: this.AssetsSelected,
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');

    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'Moved') {
        this.AssetsSelected.length = 0;

        this.refreshAssets.emit();
      }
    });
  }
  exportToExcel() {
    this.assetsService.getDataForExcel(this.filters);
  }
}
