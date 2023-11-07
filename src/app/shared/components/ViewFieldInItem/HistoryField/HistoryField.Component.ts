import { UntypedFormControl } from '@angular/forms';
import { shareReplay, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import * as moment from 'moment';
import { ViewItemInFieldService } from '../view-field-in-item.service';

@Component({
  selector: 'history-field',
  templateUrl: 'HistoryField.Component.html',
})
export class HistoryFieldComponent implements OnInit {
  FieldsHistroy$: Observable<any>;
  Loading: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<HistoryFieldComponent>,
    @Inject(MAT_DIALOG_DATA) public Params: any,
    public service: ViewItemInFieldService
  ) {}
  basicOptions: any;
  basicData: any;
  dataChart: any;
  searchField = new UntypedFormControl();
  ngOnInit(): void {
    this.Loading = true;
    this.optionChart();

    this.FieldsHistroy$ = this.service.getFieldsHistroy(this.Params);
    this.FieldsHistroy$.subscribe((value) => {
      this.Loading = false;
      this.dataChart = value;
      this.initChart();
    });
  }
  initChart() {
    this.basicData = {
      labels: this.dataChart
        .map((value: any) => moment(value.ModifiedDate).format('YYYY-MM-DD'))
        .reverse(),
      datasets: [
        {
          label: 'History',
          data: this.dataChart.map((value: any) => value.FieldValue).reverse(),
          fill: false,
          borderColor: '#42A5F5',
          tension: 0.4,
        },
      ],
    };
  }
  optionChart() {
    this.basicOptions = {
      plugins: {
        legend: {
          labels: {
            color: '#495057',
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: '#495057',
          },
          grid: {
            color: '#ebedef',
          },
        },
        y: {
          ticks: {
            color: '#495057',
          },
          grid: {
            color: '#ebedef',
          },
        },
      },
    };
  }
  Close() {
    this.dialogRef.close();
  }
}
