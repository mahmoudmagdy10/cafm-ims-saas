import { GeolocationService } from '@ng-web-apis/geolocation';
import { PmsService } from './../pms/pms.service';
import { PMcard } from './../pms/modals/pm-card/pm-card.component';
import { UntypedFormControl } from '@angular/forms';
import { MenuItem, PrimeNGConfig } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { map, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/modules/auth';
import { Subscription } from 'rxjs/internal/Subscription';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
  Component,
  OnDestroy,
  OnInit,
  AfterViewInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { workOrderService } from './workOrder.service';
import { AddNewTaskComponent } from './modals/add-new-task/add-new-task.component';
import { FilterComponent } from './modals/filter/filter.component';
import { TaskCardComponent } from './modals/task-card/task-card.component';
import { Observable, of } from 'rxjs';
import { TemplatesManagementComponent } from './modals/templates-management/templateManagement.component';
import html2canvas from 'html2canvas';
import { ApplyComponent } from './apply/apply.component';
import { HistoryForUsersWorkOnTaskComponent } from './modals/history-for-users-work-on-task/history-for-users-work-on-task.component';
import { PrintReportComponent } from './modals/print-report/print-report.component';
import { TranslateService } from '@ngx-translate/core';
import { FilterForPrintPdfComponent } from './modals/filter-for-print-pdf/filter-for-print-pdf.component';
import { WeeklyPrintWorkOrderComponent } from './modals/Weekly-print-work-order/Weekly-print-work-order.component';

@Component({
  selector: 'app-work-order',
  templateUrl: './workOrder.component.html',
  styleUrls: ['./workOrder.component.scss'],
})
export class workOrderComponent implements OnInit, OnDestroy, AfterViewInit {
  geolocationSubsciption: Subscription;
  Total$: Observable<any>;
  location_key = environment.location_api_key;
  lableTasks: any;
  constructor(
    public dialog: MatDialog,
    public service: workOrderService,
    private auth: AuthService,
    private route: ActivatedRoute,
    private readonly geolocation$: GeolocationService,
    private translate: TranslateService,
    private router: Router,
    private primengConfig: PrimeNGConfig,
    private _pmsService: PmsService,
    private http: HttpClient
  ) {  this.lableTasks = this.translate.instant('All');
}

  initTabsMenu(): void {
    this.filterStatuses = [
      {
        label: this.translate.instant('All'),
        command: () => {
          (this.lableTasks = this.translate.instant('All')),
            this.filterByMenu(null);
        },
      },

      {
        label: this.translate.instant('Open'),
        command: () => {
          (this.lableTasks = this.translate.instant('Open')),
            this.filterByMenu(1);
        },
      },
      {
        label: this.translate.instant('In_Process'),
        command: () => {
          (this.lableTasks = this.translate.instant('In_Process')),
            this.filterByMenu(2);
        },
      },
      {
        label: this.translate.instant('Pending'),
        command: () => {
          (this.lableTasks = this.translate.instant('Pending')),
            this.filterByMenu(5);
        },
      },
      {
        label: this.translate.instant('TC_filter'),
        command: () => {
          (this.lableTasks = this.translate.instant('TC_filter')),
            (this.dataFilter = {
              ...this.dataFilter,
              TaskStatusId: null,
              isTC: true,
            });
          this.refreshData();
        },
      },
    ];
    this.activeStatus = this.filterStatuses[0];
    this.filterByMenu(null);
  }
  ngAfterViewInit(): void {
    this.filter$ = this.service.filter$;
    // this.geolocation$
    this.geolocation$.subscribe((possition: any) => {
      if (possition.coords) {
        this.service.LocationForUser = possition;
        localStorage.setItem('longitude', possition?.coords?.longitude);
        localStorage.setItem('latitude', possition?.coords?.latitude);
      }
    });
    // this.getFallbackLocation();
  }
  getFallbackLocation() {
    const url = `https://api.ipapi.com/check`;
    this.http
      .get('https://api.ipify.org/?format=json')
      .subscribe((res: any) => {
        const ipAdress = res?.ip;
        this.http
          .get(
            'http://api.ipstack.com/' +
              ipAdress +
              '?access_key=' +
              this.location_key,
            res?.ip
          )
          .subscribe((res: any) => {
            console.log(55555, res);
            const possition = {
              coords: {
                longitude: res?.longitude,
                latitude: res?.latitude,
              },
            };
            localStorage.setItem('longitude', res?.longitude);
            localStorage.setItem('latitude', res?.latitude);
            this.service.LocationForUser = possition;
          });
        console.log(4444444, res);
      });
  }
  InternalNumberToScroll = new UntypedFormControl();
  workOrderCompleted: boolean = false;
  CompletedType: any;
  viewType: string = 'List';
  dataFilter: any = {};
  subscription: Subscription;
  interval: any;
  statistics$: Observable<any>;
  Tasks$: Observable<any>;
  codes$: Observable<any>;
  filter$: Observable<any> = of([]);
  Codes: any;
  Total: number = 0;
  showStatistic = false;
  selectedPage = 1;
  visibleSidebar1 = false;
  filterStatuses: MenuItem[];
  activeStatus: any;
  Setting: any;
  DataTasksForReport$: Observable<any>;
  isPM: boolean = false;
  TotalCount$!: Observable<boolean>;
  ngOnInit(): void {
    this.workOrderCompleted = this.route.snapshot.data['workOrderCompleted'];
    this.service.workOrderCompleted = this.workOrderCompleted;

    this._pmsService.getCodePms();
    this.service.getDate();
    this.primengConfig.ripple = true;
    this.service.filterSub.next([]);
    this.Total$ = this.service.Total$.pipe(
      tap((value) => (this.Total = value))
    );

    this.service.getCodePreventiveTasks();

    if (this.workOrderCompleted) {
      this.viewType = 'List';
    }
    this.dataFilter = {};
    this.route.queryParams.subscribe((params) => {
      this.dataFilter = {
        ...this.dataFilter,
        ...params,
      };
      if (params?.TaskNumber) {
        this.service.filterSub.next([
          {
            label:
              'PREVENTIVE_TASKS_MANAGEMENT.MODALS.FILTER_MODAL.TASK_NUMBER',
            value: params.TaskNumber,
          },
        ]);
      }
      if (params?.TaskStatusId == 1) {
        this.activeStatus = this.filterStatuses[1];
      }
      if (params?.CompletedType) {
        this.CompletedType = true;
      }
      this.initTabsMenu();
    });

    this.service.Codes$.subscribe((value) => {
      if (value) {
        this.Codes = value;
        // this.lableFilter();
      }
      //
    });
    this.Refresh();
    this.Tasks$ = this.service.AllTaskObz$.pipe(
      tap((value) => (this.Setting = value?.Setting)),

      tap((value) => {
        setTimeout(() => {
          this.scrollDown(true);
        }, 1000);
      })
    );
    this.statistics$ = this.service.AllTaskObz$.pipe(
      tap((value) => (this.Setting = value?.Setting)),

      map((value: any) => (value ? value?.statistics[0] : value))
    );

    this.codes$ = this.service.Codes$;
    this.DataTasksForReport$ = this.service?.DataTasksForReport$;
  }
  filterByMenu(TaskStatusId: any) {
    this.dataFilter = {
      ...this.dataFilter,
      TaskStatusId: TaskStatusId,
      isTC: null,
    };
    this.refreshData();
  }
  Refresh() {
    this.subscription = this.auth.getonTimer().subscribe((value: any) => {
      if (this.interval) {
        clearInterval(this.interval);
      }

      let TimerRefresh = localStorage.getItem('TimerRefresh');

      if (TimerRefresh != '0' && TimerRefresh != 'now' && TimerRefresh) {
        this.interval = setInterval(() => {
          this.refreshData();
          this.service.getCodePreventiveTasks();
        }, +TimerRefresh);
      } else if (value == 'now') {
        this.refreshData();
        this.service.getCodePreventiveTasks();
      }
    });
  }
  refreshData() {
    this.service.getDate();
    this.service.getAllTask({
      ...this.dataFilter,
      isPM: this.isPM,
      CompletedType: this.workOrderCompleted
        ? this.CompletedType
          ? 2
          : 1
        : null,
      TaskStatusId: this.CompletedType ? 4 : this.dataFilter.TaskStatusId,
    });
  }

  AddNewTask() {
    const dialogRef = this.dialog
      .open(AddNewTaskComponent, {
        width: '60vw',
        data: {},
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.openSuccess(result);
      }
    });
  }
  openSuccess(data: any) {
    const dialogRef = this.dialog
      .open(ApplyComponent, {
        width: '50vw',
        data: data,
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        switch (value.action) {
          case 'openCardAddTask':
            this.refreshData();
            this.AddNewTask();
            break;
          case 'FilterAsAddedTask':
            this.dataFilter = { TaskNumber: value.data.InternalNumber };
            this.service.filterSub.next([
              {
                label:
                  'PREVENTIVE_TASKS_MANAGEMENT.MODALS.FILTER_MODAL.TASK_NUMBER',
                value: value.data.InternalNumber,
              },
            ]);
            this.refreshData();
            break;
          case 'OpenCardAddedTask':
            this.openCardTask({ ID: value.data.rv });
            break;
        }
      }
    });
  }
  openCardTask(item: any) {
    this.InternalNumberToScroll.setValue(item?.InternalNumber);
    const dialogRef = this.dialog
      .open(TaskCardComponent, {
        width: '80vw',
        data: {
          orderItem: item,
          filter: {
            Id: item.ID,
            CompletedType: this.workOrderCompleted
              ? this.CompletedType
                ? 2
                : 1
              : null,
          },
        },
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');

    dialogRef.afterClosed().subscribe((result) => {
      if (!this.workOrderCompleted || result) {
        // this.refreshData();
      }
      this.refreshData();
    });
  }
  CardPPm(ID: any) {
    const dialogRef = this.dialog
      .open(PMcard, {
        width: '70vw',
        data: { ID: ID, fromScheduleTime: true },
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');
  }

  openHistoryWorkersForTask(item: any) {
    const dialogRef = this.dialog
      .open(HistoryForUsersWorkOnTaskComponent, {
        width: '60vw',
        data: {
          TechnicalData: item?.TechnicalData,
        },
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');
  }
  openLink(dataEdit: any) {
    let hostAssets;
    const url: string = window.location.href;
    if (dataEdit.TaskStatusId == 3) {
      hostAssets =
        url.split('/')[0] +
        '/' +
        url.split('/')[1] +
        '/' +
        url.split('/')[2] +
        '/' +
        `WorkOrder/card/${dataEdit.ID}?CompletedType=1`;
    } else if (dataEdit.TaskStatusId == 4) {
      hostAssets =
        url.split('/')[0] +
        '/' +
        url.split('/')[1] +
        '/' +
        url.split('/')[2] +
        '/' +
        `WorkOrder/card/${dataEdit.ID}?CompletedType=2`;
    } else {
      hostAssets =
        url.split('/')[0] +
        '/' +
        url.split('/')[1] +
        '/' +
        url.split('/')[2] +
        '/' +
        `WorkOrder/card/${dataEdit.ID}`;
    }

    window.open(hostAssets, '_blank');
  }
  resetInstructionFromTasks(ID: any) {
    this.service.resetInstructionFromTasks(ID).subscribe(
      (res: any) => {
        if (res.rv > 0) {
          this.refreshData();
        } else {
        }
      },
      (err) => {}
    );
  }
  filter() {
    const dialogRef = this.dialog
      .open(FilterComponent, {
        width: '60vw',
        data: { filters: this.dataFilter },
        disableClose: true,
      })

      .addPanelClass('cmms-custom-modal');
    dialogRef.afterClosed().subscribe((dataFilter) => {
      if (dataFilter) {
        this.dataFilter = dataFilter;
        // sss
        this.service.resetSelected.next();
        this.refreshData();
      }
    });
  }
  clearFilter() {
    this.service.filterSub.next(false);
    this.dataFilter = {};
    this.refreshData();
    this.router.navigate(['.'], { relativeTo: this.route });
  }
  ngOnDestroy() {
    this.service.resetSelected.next();

    if (this.interval) {
      clearInterval(this.interval);
    }
    // this.geolocationSubsciption.unsubscribe();
    this.subscription?.unsubscribe();
  }

  templatesManagement() {
    const dialogRef = this.dialog
      .open(TemplatesManagementComponent, {
        width: '60vw',
        data: {},
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');
  }
  reOpen(ID: any) {
    this.service.ReOpen({ ids: ID }).subscribe(
      (res: any) => {
        if (res.rv > 0) {
        } else {
        }
      },
      (err) => {}
    );
  }
  export() {
    this.service.getDataForExcel(this.dataFilter);
  }
  // @ViewChild('Report') Report!: ElementRef<HTMLImageElement>;

  // exportPDF() {
  //   html2canvas(this.Report.nativeElement).then((canvas) => {
  //     const imgData = canvas.toDataURL('image/jpeg');

  //     const pdf = new jsPDF({
  //       orientation: 'portrait',
  //     });

  //     const imageProps = pdf.getImageProperties(imgData);

  //     const pdfw = pdf.internal.pageSize.getWidth();

  //     const pdfh = (imageProps.height * pdfw) / imageProps.width;

  //     pdf.addImage(imgData, 'PNG', 0, 0, pdfw, pdfh);

  //     pdf.save('output.pdf');
  //   });
  // }
  openReport() {
    const dialogRef = this.dialog
      .open(PrintReportComponent, {
        width: '60vw',
        data: {},
        disableClose: true,
        autoFocus: false,
      })
      .addPanelClass('cmms-custom-modal');
  }
  scrollDown(justIfTaskNo?: any) {
    const max = document.documentElement.scrollHeight;
    // console.log('pos',`${}/${}`);

    // if (pos === max) {
    //   console.log("Reached bottom of page");
    // }
    if (this.InternalNumberToScroll.value) {
      if (max > window.innerHeight + 100) {
        var elem = document.getElementById(
          'ele-' + this.InternalNumberToScroll.value
        );
        elem!.scrollIntoView();
        setTimeout(() => {
          window.scrollTo({ top: window.scrollY - 100 });
        }, 1000);
      }
    } else {
      if (!justIfTaskNo) {
        window.scroll(0, 1000000000000000000);
      }
    }
  }
  filterReport() {
    const dialogRef = this.dialog
      .open(FilterForPrintPdfComponent, {
        width: '60vw',
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');
    dialogRef.afterClosed().subscribe((dataFilter) => {
      if (dataFilter) {
        this.service.FilterReport = {
          CompletedType: this.workOrderCompleted
            ? this.CompletedType
              ? 2
              : 1
            : null,
          TaskStatusId: this.CompletedType ? 4 : this.dataFilter.TaskStatusId,
          ...dataFilter,
        };
        this.service.getAllTaskForReport();
      }
    });
  }

  weeklyPrint() {
    const dialogRef = this.dialog
      .open(WeeklyPrintWorkOrderComponent, {
        width: '50vw',
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');
  }
  //   lablesFilter: any[] = [];
  //   lableFilter() {
  //     if (this.dataFilter.UserID) {
  //       this.lablesFilter.push({
  //         label: 'PREVENTIVE_TASKS_MANAGEMENT.MODALS.FILTER_MODAL.USERNAME',
  //         value: this.Codes.LocationUsers.find(
  //           (value: any) => value.Code == this.dataFilter.UserID
  //         ).Name,
  //       });
  //     }
  //     if (this.dataFilter.TaskName) {
  //       this.lablesFilter.push({
  //         label: 'PREVENTIVE_TASKS_MANAGEMENT.MODALS.FILTER_MODAL.TASK_NAME',
  //         value: this.dataFilter.TaskName,
  //       });
  //     }
  //     if (this.dataFilter.PriorityId) {
  //       this.lablesFilter.push({
  //         label: 'PREVENTIVE_TASKS_MANAGEMENT.MODALS.FILTER_MODAL.PRIORITY_LEVEL',
  //         value: this.Codes.PriorityId.find(
  //           (value: any) => value.code == this.dataFilter.PriorityId
  //         ).Name,
  //       });
  //     }
  //     if (this.dataFilter.TaskStatusId) {
  //       this.lablesFilter.push({
  //         label: 'PREVENTIVE_TASKS_MANAGEMENT.MODALS.FILTER_MODAL.TASK_STATUS',
  //         value: this.Codes.TaskStatusId.find(
  //           (value: any) => value.Code == this.dataFilter.TaskStatusId
  //         ).Name,
  //       });
  //     }
  //     if (this.dataFilter.TaskTypeId) {
  //       this.lablesFilter.push({
  //         label: 'PREVENTIVE_TASKS_MANAGEMENT.MODALS.FILTER_MODAL.TASK_TYPE',
  //         value: this.Codes.TaskTypeId.find(
  //           (value: any) => value.Code == this.dataFilter.TaskTypeId
  //         ).Name,
  //       });
  //     }
  //     if (this.dataFilter.FromDueDate) {
  //       this.lablesFilter.push({
  //         label:
  //           'PREVENTIVE_TASKS_MANAGEMENT.MODALS.FILTER_MODAL.DUE_TO_DATE_FROM',
  //         value: this.dataFilter.FromDueDate,
  //       });
  //     }
  //     if (this.dataFilter.ToDueDate) {
  //       this.lablesFilter.push({
  //         label: 'PREVENTIVE_TASKS_MANAGEMENT.MODALS.FILTER_MODAL.DUE_TO_DATE_TO',
  //         value: this.dataFilter.ToDueDate,
  //       });
  //     }
  //     if (this.dataFilter.FromMaintenanceDuration) {
  //       this.lablesFilter.push({
  //         label:
  //           'PREVENTIVE_TASKS_MANAGEMENT.MODALS.FILTER_MODAL.MAINTENANCE_DURATION_DATE_FROM',
  //         value: this.dataFilter.FromMaintenanceDuration,
  //       });
  //     }
  //     if (this.dataFilter.ToMaintenanceDuration) {
  //       this.lablesFilter.push({
  //         label:
  //           'PREVENTIVE_TASKS_MANAGEMENT.MODALS.FILTER_MODAL.MAINTENANCE_DURATION_DATE_TO',
  //         value: this.dataFilter.ToMaintenanceDuration,
  //       });
  //     }
  //     if (this.dataFilter.FromDamageDuration) {
  //       this.lablesFilter.push({
  //         label:
  //           'PREVENTIVE_TASKS_MANAGEMENT.MODALS.FILTER_MODAL.BROKEN_DURATION_DATE_FROM',
  //         value: this.dataFilter.FromDamageDuration,
  //       });
  //     }
  //     if (this.dataFilter.ToDamageDuration) {
  //       this.lablesFilter.push({
  //         label:
  //           'PREVENTIVE_TASKS_MANAGEMENT.MODALS.FILTER_MODAL.BROKEN_DURATION_DATE_TO',
  //         value: this.dataFilter.ToDamageDuration,
  //       });
  //     }
  //     if (this.dataFilter.TaskNumber) {
  //       this.lablesFilter.push({
  //         label: 'PREVENTIVE_TASKS_MANAGEMENT.MODALS.FILTER_MODAL.TASK_NUMBER',
  //         value: this.dataFilter.TaskNumber,
  //       });
  //     }
  //     if (this.dataFilter.CreatedByName) {
  //       this.lablesFilter.push({
  //         label: 'PREVENTIVE_TASKS_MANAGEMENT.CREATED_BY',
  //         value: this.dataFilter.CreatedByName,
  //       });
  //     }
  //     this.service.filterSub.next(this.lablesFilter);
  //   }
}
