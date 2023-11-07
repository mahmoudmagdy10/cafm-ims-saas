import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddActionComponent } from 'src/app/shared/components/AddAction/add-action.component';
import { LogsByComponentTypeService } from 'src/app/shared/components/logs-by-component-type/logs-by-component-type.service';

@Component({
  selector: 'movement-history',
  templateUrl: 'movementHistory.component.html',
})
export class movementHistoryComponent implements OnInit {
  constructor(public dialog: MatDialog, private logsByComponentTypeService: LogsByComponentTypeService) {}
  @Input() data: any;
  @Input() AssetsLogEdit: any;
  ngOnInit(): void {
    this.data.AssetsLogs = this.data.AssetsLogs?.reverse();
  }

  addAction() {
    const dialogRef = this.dialog.open(AddActionComponent, {
      width: '70vw',
      data: { ID: this.data.ID, ComponentType: 'Assets' },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.data.AssetsLogs.unshift(result);
        this.logsByComponentTypeService.getLogsByComponentType('Assets');
      }
    });
  }
}
