import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { TaskCardComponent } from '../../work-order/modals/task-card/task-card.component';
import { MatDialog } from '@angular/material/dialog';
import { SparePartService } from '../../stores/spare-parts.service';
import { StoreCard } from '../../stores/modals/spare-parts-card/spare-parts-card.component';

@Component({
  selector: 'app-work-order-table',
  templateUrl: './work-order-table.component.html',
  styleUrls: ['./work-order-table.component.scss']
})
export class WorkOrderTableComponent implements OnInit, OnChanges {
  @Input() selectedPage: number;
  @Input() dataType: number | null;
  @Input() data: any;

  constructor(private dialog: MatDialog, private _SparePartService: SparePartService) { }

  ngOnInit(): void {
    // console.log('selectedPage', this.selectedPage)
  }
  ngOnChanges(): void {
  }

  openCard(item: any) {
    const dialogRef = this.dialog.open(TaskCardComponent, {
      width: '80vw',
      data: {
        filter: {
          Id: item.WorkOrderID,
        },
      },
      disableClose: true,
    });
  }

  SparePartCard(ID: any) {
    this._SparePartService.getItemEdit(ID);
    this._SparePartService.getTransactions();
    this._SparePartService.getCodes();
    const dialogRef = this.dialog
      .open(StoreCard, {
        width: '80vw',
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');
  }

}
