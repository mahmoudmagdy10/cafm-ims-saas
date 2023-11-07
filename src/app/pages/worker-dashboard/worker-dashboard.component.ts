import { UntypedFormControl } from '@angular/forms';
import { tap, startWith } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { DashboardFilter } from './filter/dashboard-filter.component';
import { MatDialog } from '@angular/material/dialog';
import { DashboardService } from '../dashboard/dashboard.service';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-worker-dashboard',
  templateUrl: './worker-dashboard.component.html',
  styleUrls: ['./worker-dashboard.component.scss'],
})
export class WorkerDashboardComponent implements OnInit {
  constructor(public dialog: MatDialog, private service: DashboardService) {}
  DashboardData$: Observable<any>;

  dir: any;
  chartOptions: any;
  dataChartPlanned: any;
  dataChartCompletedTask: any;
  cur: string = localStorage.getItem('currencyName')!;
  LocationSelected = new UntypedFormControl();
  locations: any;
  ngOnInit(): void {
    this.dataLocation();
    this.chartOptions = {
      // plugins: {
      legend: {
        display: false,
        // labels: {
        //   color: '#495057',
        // },
        // },
      },
    };

    this.dir = document.dir;
    this.LocationSelected.valueChanges
      .pipe(startWith(''))
      .subscribe((value) => {
        this.DashboardData$ = this.service.GetDashboardWorker().pipe(
          tap((value) => {
            this.dataChartPlanned = {
              labels: ['Planned', 'Unplanned'],
              datasets: [
                {
                  data: [value[0].Planned, value[0].Unplanned],
                  backgroundColor: ['#42A5F5', '#66BB6A'],
                  hoverBackgroundColor: ['#64B5F6', '#81C784'],
                },
              ],
            };
            this.dataChartCompletedTask = {
              labels: ['CompletionTime', ' '],
              datasets: [
                {
                  data: [
                    value[0].CompletionTime,
                    100 - +value[0].CompletionTime,
                  ],
                  backgroundColor: ['#42A5F5', '#66BB6A'],
                  hoverBackgroundColor: ['#64B5F6', '#81C784'],
                },
              ],
            };
          })
        );
      });
  }

  Filter() {
    const dialogRef = this.dialog
      .open(DashboardFilter, {
        width: '60vw',
        disableClose: true,

      })
      .addPanelClass('cmms-custom-modal');
  }
  dataLocation() {
    this.locations = JSON.parse(localStorage.getItem('locations')!);

  }
}
