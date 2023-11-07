import { skip, tap } from 'rxjs/operators';
import { Observable, Subscription, observable } from 'rxjs';
import { FilterDashboardComponent } from './filter-dashboard/filter-dashboard.component';
import { MatDialog } from '@angular/material/dialog';
import { NewDashboardService } from './new-dashboard.service';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import * as moment from 'moment';
import { UIChart } from 'primeng/chart';
import { trigger, transition, style, animate } from '@angular/animations';
import { TranslateService } from '@ngx-translate/core';
import { ViewDataFilterService } from 'src/app/shared/components/view-data-filter/view-data-filter.service';
import { UserAndTeamsModal } from 'src/app/shared/modalsShared/User&TeamsModal/User&TeamsModal.component';

@Component({
  selector: 'app-new-dashboard',
  templateUrl: './new-dashboard.component.html',
  styleUrls: ['./new-dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None,

  // animations: [
  //   trigger('fadeIn', [
  //     transition(':enter', [
  //       style({ opacity: 0 }),
  //       animate('0.4s', style({ opacity: 1 })),
  //     ]),
  //   ]),
  // ],
})
export class NewDashboardComponent implements OnInit {
  @ViewChild('tasksChart') tasksChart: ElementRef;
  selectedChartType: any;
  chartType: any;
  chartTypes:any;
  chartSizes = [
    { label: 'Half Size', value: 'half' },
    { label: 'Full Size', value: 'full' },
  ];
  sortableOptions: any = {
    group: 'formulaItems',
    store: {
      set: (sortable: any) => {
        const order = sortable.toArray();
        localStorage.setItem('itemOrder', order.join('|'));
      },
    },
  };
  selectedPercentageType: any;
  PercentageTotal: any = 'Numbers';
  PercentageType:any[];
  dataItems: { count_items: number; title: string }[] = [];
  subscriptionForDataFilter: Subscription;
  itemsCheckedTeams: any;
  itemsCheckedUsers: any;
  chartData: any;
  dataDashboard$: Observable<any>;
  dataDashboardReports: any;
  ShowChartLine: any;
  percentages: number[] = [];
  colorMap = new Map();
  pieOptions: any = {
    responsive: false,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: 'blue',
          usePointStyle: true,
          font: {
            size: 11,
          },
          padding: 20,
        },
        position: 'right',
      },
    },
    animation: {
      duration: 0, // general animation time
    },
    layout: {
      padding: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
    },
    scales: {
      x: {
        display: false, // this will remove all the x-axis grid lines
      },
      y: {
        display: false, // this will remove all the y-axis grid lines
      },
    },
    width: 300, // specifying width
    height: 300, // specifying height
  };

  barOptions = {
    responsive: false,
    maintainAspectRatio: true,
    // animation: {
    //     duration: 0,
    // },

    plugins: {
      legend: {
        labels: {
          color: 'blue',
          usePointStyle: true,
          font: {
            size: 12,
          },
          padding: 15,
        },
        position: 'bossttom',
      },
      //
    },
  };

  lineOptions = {
    responsive: false,
    maintainAspectRatio: true,

    // animation: {
    //     duration: 0,
    // },

    plugins: {
      legend: {
        labels: {
          display: false,
          color: 'blue',
          usePointStyle: true,
          font: {
            size: 12,
          },
          padding: 15,
        },
        position: 'top',
      },
      //
    },
  };
  constructor(
    private _newDashboardService: NewDashboardService,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private translateService: TranslateService,
    private _viewDataFilterService: ViewDataFilterService
  ) {
    this.chartTypes = [
      { label: this.translateService.instant('Pie_Chart'), value: 'pie' },
      { label: this.translateService.instant('Bar_Chart'), value: 'bar' },
      { label: this.translateService.instant('Line_Chart'), value: 'line' },
      { label: this.translateService.instant('Table Chart'), value: 'table' },
    ];
    this.PercentageType = [
      { label: this.translateService.instant('Numbers_Chart'), value: 'Numbers' },
      {
        label: this.translateService.instant('Percentage_Chart'),
        value: 'Percentage',
      },
    ];
    // Dummy data, replace with your actual chart data
    this.chartData = {
      labels: ['Label 1', 'Label 2', 'Label 3'],
      datasets: [
        {
          data: [300, 500, 200],
          backgroundColor: ['#FF5733', '#33FF57', '#5733FF'],
        },
      ],
    };
  }
  chartLine: any;
  ngOnInit() {
    this.subscriptionForDataFilter = this._viewDataFilterService
      .SelectorFilterByComponent$('dashboard', 'dataFilter')
      .pipe(skip(1))
      .subscribe((value: any) => {
        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() - 7);
        if (!value.forview || !value.forview.length) {
          value.forview = [
            {
              label: '',
              value: moment(tomorrow).format('YYYY-MM-DD'),
            },
            { label: '', value: moment(today).format('YYYY-MM-DD') },
          ];
        } else {
        }
      });
  }
  chart: any;

  ngAfterViewInit() {
    this.initCharts();
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() - 7);
    this._newDashboardService.GetDashboard({
      FromDate: tomorrow,
      ToDate: today,
      LastDaysID: 'Last7days',
    });
  }
  initCharts() {
    this.dataDashboard$ = this._newDashboardService.dataDashboard$.pipe(
      tap((val) => {
        if (val?.data?.Reports?.length) {
          this.dataDashboardReports = this.mergeReports(val.data.Reports);
          this.dataDashboardReports = [...this.dataDashboardReports];
          // استخدم مجموعة Set للحفاظ على الأسماء الفريدة فقط
          this.dataItems.splice(0, this.dataItems.length);

          this.dataDashboardReports = this.dataDashboardReports.filter(
            (report: any) => {
              if (report.ReportData[0]?.Chartype === 'KPI') {
                this.dataItems.push({
                  count_items: report.ReportData[0]?.count_items || 0,
                  title: report.ReportData[0]?.title || 'N/A',
                });
              }
              return report.ReportData[0]?.Chartype !== 'KPI'; // استبعاد البيانات التي Chartype يساوي 'KPI'
            }
          );

          this.dataDashboardReports.forEach((report: any) => {
            report.chartNumbers = this.getChartData(report, 'Numbers');
            report.chartPer = this.getChartData(report, '');
            report.LineChartData = this.getMergedLineChartData(
              report.ReportData
            );
            // تحقق مما إذا كانت البيانات من نوع 'KPI' قبل عرضها في الـ chart
            // if (report.ReportData[0]?.Chartype === 'KPI') {
            //   // البيانات من نوع 'KPI': استخدم القيم من هذا النوع
            //   report.LineChartData = this.getMergedLineChartData(
            //     report.ReportData,
            //     report
            //   );
            // } else {
            //   // البيانات ليست من نوع 'KPI': استخدم قيم افتراضية أو ما تحتاجه هنا
            //   report.LineChartData = {}; // يمكنك تعيين قيم افتراضية أو فارغة حسب الحاجة
            // }
          });

          this.dataDashboardReports = this.groupByGroupName(
            this.dataDashboardReports
          );
          // قم بتحويل مجموعة الأسماء الفريدة إلى مصفوفة مرة أخرى
          this.cdr.detectChanges();
        }
      })
    );
  }

  ChartType(event: any) {
    this.chartType = event.value;
  }

  filter() {
    const dialogRef = this.dialog
      .open(FilterDashboardComponent, {
        width: '50vw',
        disableClose: true,
        data: {},
      })
      .addPanelClass('cmms-custom-modal');
    dialogRef.afterClosed().subscribe((dataFilter) => {});
  }
  getChartData(report: any, PercentageTotal: any) {
    let uniqueLabels = Array.from(
      new Set(report.ReportData.map((item: any) => item.TitleName))
    );

    const dataValues =
      PercentageTotal == 'Numbers'
        ? uniqueLabels.map((label: any) => {
            const item = report.ReportData.find(
              (item: any) => item.TitleName === label
            );
            return item ? item.count_items : 0;
          })
        : uniqueLabels.map((label: any) => {
            const item = report.ReportData.find(
              (item: any) => item.TitleName === label
            );
            return item ? item.percent_each_item : 0;
          });

    // Update uniqueLabels
    uniqueLabels = uniqueLabels.map((label: any, index: any) => {
      return (
        label +
        ' ' +
        (PercentageTotal == 'Numbers'
          ? dataValues[index]
          : dataValues[index] + '%')
      );
    });
    const chartData = {
      labels: uniqueLabels ? uniqueLabels : '',
      datasets: [
        {
          data: dataValues,
          backgroundColor: [
            'rgba(135,206,235,1)', // SkyBlue
            'rgba(70,130,180,1)', // SteelBlue
            'rgba(0,191,255,1)', // DeepSkyBlue
            'rgba(100,149,237,1)', // CornflowerBlue
            'rgba(0,0,139,1)', // DarkBlue
            'rgba(0,0,205,1)', // MediumBlue
            'rgba(25,25,112,1)', // MidnightBlue
            'rgba(173,216,230,1)', // LightSteelBlue
            'rgba(176,224,230,1)', // PowderBlue
            'rgba(240,248,255,1)', // AliceBlue
            'rgba(240,248,255,1)', // LightCyan
            'rgba(95,158,160,1)', // CadetBlue
            'rgba(70,130,180,1)', // SteelBlue
            'rgba(123,104,238,1)', // MediumSlateBlue
            'rgba(106,90,205,1)', // SlateBlue
            'rgba(72,61,139,1)', // DarkSlateBlue
          ],
          barThickness: 22,
          borderRadius: 12,
        },
      ],
      datalabels: {
        color: '#000',
        align: 'end',
        anchor: 'end',
        formatter: function (value: any, context: any) {
          return value;
        },
      },
    };

    // حساب النسب المئوية وتخزينها في مصفوفة النسب
    const totalCount = report.ReportData.length;
    this.percentages = uniqueLabels.map((label: any) => {
      const count = report.ReportData.filter(
        (item: any) => item.TitleName === label
      ).length;
      return (count / totalCount) * 100;
    });

    return chartData;
  }

  isLineChart(report: any): boolean {
    return report.ReportData.some((item: any) => item.Chartype === 'Line');
  }
  mergeReports(reports: any) {
    let mergedReports: any = {};

    reports?.forEach((report: any) => {
      if (report && report.ReportName) {
        if (!mergedReports[report.ReportName]) {
          mergedReports[report.ReportName] = {
            GroupName: report.GroupName,
            ReportName: report.ReportName,
            PercentageType: report?.ReportData?.[0]?.PercentageType,
            chartTypes: report?.ReportData?.[0]?.chartTypes,
            dashBoardReportID: report.ReportId, // تحديث dashBoardReportID هنا

            ReportData: Array.isArray(report.ReportData)
              ? [...report.ReportData]
              : [],
          };
        } else if (Array.isArray(report.ReportData)) {
          mergedReports[report.ReportName].ReportData.push(
            ...report.ReportData
          );
        }
      }
    });

    return Object.values(mergedReports);
  }

  mergeLabels(reportData: any) {
    let mergedLabels: any = {};

    reportData?.forEach((dataItem: any) => {
      if (dataItem.labels && dataItem.labels.length) {
        dataItem.labels.forEach((label: string) => {
          if (!mergedLabels[label]) {
            mergedLabels[label] = 1;
          } else {
            mergedLabels[label]++;
          }
        });
      }
    });
    return mergedLabels;
  }

  getMergedLineChartData(reportData: any) {
    const lineData = reportData.filter(
      (item: any) => item.Chartype === 'Line' && item.TitleName
    );
    let chartData: any;
    let transformedData = this.transformData(lineData);
    let datasets = [];
    let colorsUsed:any = {};  // Keep track of colors already used

    for (let title in transformedData) {
        let color = this.generateRandomColor();

        // Ensure unique colors. This loop is optional and just makes sure you don't have duplicate colors.
        while(colorsUsed[color]) {
            color = this.generateRandomColor();
        }

        colorsUsed[color] = true;

        datasets.push({
            label: title,
            data: transformedData[title].data,
            fill: false,
            borderColor: color,
            backgroundColor: color // Use this if you want the points or bars to be colored as well
        });
    }
    try {
      chartData = {
        labels: transformedData[Object.keys(transformedData)[0]].labels,
        datasets: datasets,
      };
    } catch {
      chartData = {
        labels: [],
        datasets: [],
      };
    }

    return chartData;
  }
  generateRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

  transformData(data: any[]) {
    if (!data?.length) {
      return;
    }
    let result: any = {};

    data.forEach((item) => {
      if (!result[item.TitleName]) {
        result[item.TitleName] = {
          labels: [],
          data: [],
        };
      }

      result[item.TitleName].labels.push(
        new Date(item.DueDate).toLocaleDateString()
      );
      result[item.TitleName].data.push(item.count_items);
    });

    // Check if the result object is empty
    if (Object.keys(result).length === 0) {
      console.error('Transformed data is empty!');
      return null;
    }

    return result;
  }

  groupByGroupName(data: any[]): any[] {
    const grouped: Record<string, any[]> = {};

    // Initialize the "All Groups" group to store all reports.
    grouped['All Groups'] = [];

    for (const report of data) {
      const groupName = report.GroupName;

      // Append every report to the "All Groups" group.
      grouped['All Groups'].push(report);

      if (!grouped[groupName]) {
        grouped[groupName] = [];
      }

      grouped[groupName].push(report);
    }

    const result: any[] = [];

    for (const groupName in grouped) {
      result.push({
        groupName: groupName,
        values: grouped[groupName],
      });
    }

    return result;
  }

  isTableChart(report: any): boolean {
    return report.ReportData.some((item: any) => item.Chartype === 'TABLE');
  }
  selectedLinePriorities: string[] = [];

  onRadioChange(report: any, selectedLinePriority: string) {
    // تحقق مما إذا كانت القيمة محددة بالفعل وإضافتها إلى المصفوفة إذا لم تكن محددة
    // const index = this.selectedLinePriorities.indexOf(selectedLinePriority);
    // if (index === -1) {
    //   this.selectedLinePriorities.push(selectedLinePriority);
    // } else {
    //   // إزالة القيمة المحددة إذا تم اختيارها مرة أخرى
    //   this.selectedLinePriorities.splice(index, 1);
    // }
    // // فلترة البيانات بناءً على القيم المحددة وتحديث report.LineChartData
    // const filteredData = report.ReportData.filter((item: any) => {
    //   return this.selectedLinePriorities.includes(item.TitleName);
    // });
    // report.LineChartData = this.getMergedLineChartData(filteredData, report);
  }
  AssignmentID: any;
  openDialog(ReportId: any) {
    const dialogRef = this.dialog.open(UserAndTeamsModal, {
      width: '70vw',
      data: {
        name: 'WORKTEAMS.CARDHEADER',
        AssignmentID: this.AssignmentID,
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.AssignmentID = result.AssignmentID;
        this.itemsCheckedTeams = result.itemsCheckedTeamsIDs
          ?.map((item: any) => item.Code)
          .join(',');
        this.itemsCheckedUsers = result.itemsCheckedUsersIDs
          .map((item: any) => item.Code)
          .join(',');
        this._newDashboardService
          .UsersTeamReports({
            teamIds: this.itemsCheckedTeams,
            forUserIds: this.itemsCheckedUsers,
            dashBoardReportID: ReportId,
          })
          .subscribe((val: any) => {
            if (val.rv > 0) {
              this._newDashboardService
                .getUsersTeamReports({ ReportId: ReportId })
                .subscribe((val) => {});
            }
          });
      }
    });
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
}
