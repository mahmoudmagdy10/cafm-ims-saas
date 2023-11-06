import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';
import { LogsByComponentTypeService } from './logs-by-component-type.service';
import { AddActionComponent } from '../AddAction/add-action.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-logs-by-component-type',
  templateUrl: './logs-by-component-type.component.html',
  styleUrls: ['./logs-by-component-type.component.scss'],
})
export class LogsByComponentTypeComponent implements OnInit {
  @Input() logType: any;
  @Input() dataEdit: any;
  selectedPage = 1;
  Logs$: Observable<any>;
  @Input() refreshOnInit = true;
  isList = false;
  constructor(
    private _logsByComponentTypeService: LogsByComponentTypeService,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.Logs$ = this._logsByComponentTypeService
      .SelectorByComponent$('Logs', this.logType)
      .pipe(
        map((value) => {
          let valueList = value?.Data;
          let dailyWo = value?.Data?.reduce((acc: any, item: any) => {
            let date = item?.LogDate?.toString()?.substring(0, 10);
            if (!acc[date]) {
              acc[date] = [];
            }
            acc[date].push(item);
            return acc;
          }, {});
          let arr: any = [];
          for (var key in dailyWo) {
            if (dailyWo.hasOwnProperty(key)) {
              arr.push({ date: key, logs: dailyWo[key] });
            }
          }
          return {
            timeline: arr,
            valueList: valueList,
            Setting: value?.Setting,
          };
        })
      );
  }

  addAction() {
    const dialogRef = this.dialog.open(AddActionComponent, {
      width: '70vw',
      data: { ID: this.dataEdit.ID, ComponentType: this.logType },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this._logsByComponentTypeService.getLogsByComponentType(this.logType);
      }
    });
  }
  filter() {
    this._logsByComponentTypeService.updateStore(this.logType, {
      params: {
        ...this._logsByComponentTypeService.store.value[this.logType]['params'],

        CurrentPage: this.selectedPage,
        RowCount: 10,
      },
    });
    this._logsByComponentTypeService.getLogsByComponentType(this.logType);
  }
}
