import { PmsService } from './../../../../pms/pms.service';
import { IdentificationDescriptionModalComponent } from './identification-description-modal/identification-description-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { FilterProblemsComponent } from './filter-Problems/filter-Problems.component';
import { ViewDataFilterService } from 'src/app/shared/components/view-data-filter/view-data-filter.service';
import { tap, skip } from 'rxjs/operators';
import { assetsScreenService } from 'src/app/pages/assetsScreen/assetsScreen.service';
import { Component, OnInit, Input } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { PMcard } from 'src/app/pages/pms/modals/pm-card/pm-card.component';
import { TaskCardComponent } from 'src/app/pages/work-order/modals/task-card/task-card.component';

@Component({
  selector: 'app-problem-identification',
  templateUrl: './problem-identification.component.html',
  styleUrls: ['./problem-identification.component.scss'],
})
export class ProblemIdentificationComponent implements OnInit {
  DataList$!: Observable<any>;
  dataList: any = [];
  @Input() data: any;
  selectedPage = 1;
  RowCount: any = 50;
  filter: any = {};
  subscriptionForDataFilter: Subscription;

  constructor(
    private _assetsScreenService: assetsScreenService,
    private _viewDataFilterService: ViewDataFilterService,
    public dialog: MatDialog,
    private assetsService: assetsScreenService,
    private PmsService: PmsService
  ) {}

  ngOnInit() {
    this.subscriptionForDataFilter = this._viewDataFilterService
      .SelectorFilterByComponent$('ProblemIdentification', 'dataFilter')
      .pipe(skip(1))
      .subscribe((value) => {
        this._assetsScreenService.getProblemIdentification(this.data?.ID);
      });
    this._assetsScreenService.getProblemIdentification(this.data?.ID);
    this._assetsScreenService.ProblemIdentification$.subscribe((val: any) => {
      this.dataList = val?.Data;
    });
    // this.DataList$ = this._assetsScreenService.ProblemIdentification$.pipe(
    //   tap((val: any) => {
    //   })
    // );
  }
  changePage() {
    this._assetsScreenService.getProblemIdentification(this.data?.ID);
    this._viewDataFilterService?.updateParams('ProblemIdentification', {
      CurrentPage: this.selectedPage,
      RowCount: this.RowCount,
    });
  }
  selectedRowCount(RowCount: any) {
    this.RowCount = RowCount;
    this._assetsScreenService.RowCount = RowCount;
    this._assetsScreenService.getProblemIdentification(this.data?.ID);
  }
  Filter() {
    const dialogRef = this.dialog
      .open(FilterProblemsComponent, {
        width: '60vw',
        data: {
          Data: this.data,
          filter:
            this._viewDataFilterService.datafilterModel?.ProblemIdentification
              ?.dataFilter?.params,
        },
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');
    dialogRef.afterClosed().subscribe((value: any) => {
      if (value) {
        this.filter = value;
      }
    });
  }
  IdentificationDescription(item: any) {
    const dialogRef = this.dialog
      .open(IdentificationDescriptionModalComponent, {
        width: '60vw',
        data: {
          item,
        },
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');
    dialogRef.afterClosed().subscribe((value: any) => {
      if (value) {
      }
    });
  }
  openCard(item: any) {
    const dialogRef = this.dialog.open(TaskCardComponent, {
      width: '80vw',
      data: {
        filter: {
          Id: item.ID,
          CompletedType: 1,
        },
      },
      disableClose: true,
    });
  }
}
