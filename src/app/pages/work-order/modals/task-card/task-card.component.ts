import { UntypedFormControl } from '@angular/forms';
import { TCComponent } from './modalsCard/TC/TC.component';
import { map, tap, shareReplay, finalize, filter } from 'rxjs/operators';
import { workOrderService } from '../../workOrder.service';
import { Observable, of } from 'rxjs';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import {
  Component,
  OnInit,
  Inject,
  HostListener,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { TimeConsumingComponent } from './modalsCard/time-consuming/time-consuming.component';
import { MaintenanceTimeComponent } from './TabsCard/maintenance-time/maintenance-time.component';
import { CompleteNewTask } from './modalsCard/complete-new-task/complete-new-task.component';
import { ConfigurationService } from 'src/app/pages/settings/configurations/configurations.service';
import { ChangeToPendingComponent } from '../../change-to-pending/change-to-pending.component';
import { ApplyCompleteComponent } from './modalsCard/apply-complete/apply-complete.component';
import { LogsByComponentTypeService } from 'src/app/shared/components/logs-by-component-type/logs-by-component-type.service';

@Component({
  selector: 'task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss'],
})
export class TaskCardComponent implements OnInit {
  // dialogRef: any;
  taskEdit$: Observable<any>;
  codes$: Observable<any>;
  dataInStructionView$: Observable<any>;
  collapsed: boolean = true;
  workOrderCompleted: boolean = false;
  isForceSOP: any;
  constructor(
    public dialogRef: MatDialogRef<TaskCardComponent>,
    private toastr: ToastrService,
    private service: workOrderService,
    private _configurationService: ConfigurationService,
    private _logsByComponentTypeService: LogsByComponentTypeService,
    @Inject(MAT_DIALOG_DATA) public dataCard: any,
    public dialog: MatDialog
  ) { }
  @ViewChild('maintenanceTime') maintenanceTime: MaintenanceTimeComponent;
  WorkOrderOpened: any;
  isCalenderOpen$: Observable<any>;
  templateType: any;
  TaskNoForSearch = new UntypedFormControl();
  isContextMenuOpen$: Observable<any>;
  DataEdit: any;
  DataEditBackUp: any;
  loadingPrint: boolean = false;
  orderItem: any;
  get workOrderCompletedValue() {
    return this.service.workOrderCompleted;
  }
  accept = new UntypedFormControl(null);
  get ClientAcceptanceValue() {
    return this.accept.value;
  }
  ngOnInit(): void {
    console.log('this.dataCard :>> ', this.dataCard);
    if (this.dataCard) {
      this.orderItem = this.dataCard.orderItem;
    }
    this.templateType =
      this._configurationService.ConfigurationStorage?.WODefaultTemplate;
    this.dialogRef.disableClose = true;
    this.isCalenderOpen$ = this.service.isCalenderOpen$;
    this.codes$ = this.service.Codes$.pipe(
      tap((val: any) => {
        this.isForceSOP = val.isForceSOP;
      })
    );
    this.getTaskDetails();
    this.workOrderCompleted = this.service.workOrderCompleted;
  }
  
  getTaskDetails() {
    this.taskEdit$ = this.service
      .getTaskByID({ ...this.dataCard.filter })
      .pipe(
        filter((value) => value.Data[0]),
        tap((value) => {
          this.service.WorkOrderOpened = value.Data[0];
          this.DataEdit = value.Data[0];
          this.DataEditBackUp = value.Data[0];
          this.TaskNoForSearch.setValue(value.Data[0]?.InternalNumber);
          this.WorkOrderOpened = value.Data[0];
          this.service.getInStruction();
          this.dataInStructionView$ = this.service.dataInStructionView$.pipe(
            tap((val) => {
            })
          );
          this._logsByComponentTypeService?.startUse(
            'workOrders',
            value.Data[0]?.ID
          );
        }),
        map((value) => {
          let tagsIdParsed = '';

          try {
            tagsIdParsed = JSON.parse(value.Data[0]?.TagsId || '');
          } catch (error) {
            // Handle the JSON parsing error here (e.g., log the error)
          }

          return {
            ...value.Data[0],
            TagsId: tagsIdParsed,
          };
          // return {
          //   ...value.Data[0],
          //   TagsId: value.Data[0]?.TagsId
          //     ? JSON.parse(value.Data[0]?.TagsId)
          //     : '',
          // };
        })
      )
      .pipe(shareReplay(1));
  }
  @HostListener('window:keyup.esc') onKeyUp() {
    this.timeConsuming();
  }

  @HostListener('window:beforeunload')
  onBeforeUnload() {
    return false;
  }


  onClose() {
    this.timeConsuming();
    this.service.getAllTask({
      isPM: false,
    });
  }


  get TaskStatusId() {
    return this.WorkOrderOpened.TaskStatusId;
  }


  timeConsuming(Open?: boolean) {
    if (
      this.WorkOrderOpened?.TaskStatusId == 3 ||
      this.WorkOrderOpened?.TaskStatusId == 4
    ) {
      this.dialogRef.close();
    } else {
      this.maintenanceTime?.pauseTimer();

      if (+this.maintenanceTime?.display?.split(':')[1] > 5 || Open) {
        const dialogRef = this.dialog
          .open(TimeConsumingComponent, {
            width: '30vw',
            data: {
              Min: +this?.maintenanceTime?.display.split(':')[1],
              H: +this?.maintenanceTime?.display.split(':')[0],
              ID: this?.dataCard?.filter?.Id,
            },
            disableClose: true,
          })
          .addPanelClass('cmms-custom-modal');
        dialogRef.afterClosed().subscribe((result) => {
          if (!Open) {
            this.dialogRef.close();
          } else {
            if (result) {
              const pushLogTime$ = this.taskEdit$
                .pipe(
                  tap((value) => {
                    if (!value.WorkOrderTimeLogs) {
                      value.WorkOrderTimeLogs = [];
                    }
                    value.WorkOrderTimeLogs.push(result);
                    value.RealCompletionTime =
                      value.RealCompletionTime + result.LogPeriod;
                  })
                )
                .subscribe();
              pushLogTime$.unsubscribe();
              this.maintenanceTime.startTimer();
            } else {
              this.maintenanceTime.clearTimer();
            }
          }
        });
      } else {
        this.dialogRef.close();
      }
    }
  }

  CompleteNewTask(data: any) {
    const dialogRef = this.dialog
      .open(CompleteNewTask, {
        width: '40vw',
        data: { dataEdit: data, type: 'complete' },
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        this.service.getAllTask({});
        this.applyComplete();
        this.dialogRef.close();
      }
    });

    // this.service
    //   .InstructionCompleted({ ID: this?.dataCard?.filter?.Id })
    //   .subscribe(
    //     (res: any) => {
    //       if (res.rv > 0) {
    //

    //         this.dialogRef.close('completed');
    //       } else {
    //
    //       }
    //     },
    //     (err) => {
    //
    //     }
    //   );
  }

  applyComplete() {
    const dialogRef = this.dialog
      .open(ApplyCompleteComponent, {
        width: '40vw',
      })
      .addPanelClass('cmms-custom-modal');
  }

  Reject(data: any) {
    const dialogRef = this.dialog
      .open(CompleteNewTask, {
        width: '40vw',
        data: { dataEdit: data, type: 'Reject' },
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        this.dialogRef.close();
      }
    });
  }

  TC(data: any) {
    // قم بفحص قيمة this.isForceSOP
    if (this.isForceSOP === 1) {
      // إذا كانت this.isForceSOP تساوي 1، قم بتنفيذ الشروط الأخرى
      if (data && data.Wrk_Sop) {
        // قم بفحص العناصر داخل مصفوفة Wrk_Sop
        for (const item of data.Wrk_Sop) {
          // قم بفحص item.Value
          if (
            !item.Value ||
            item.Value.trim() === '' ||
            item.Value === 'false'
          ) {
            // إذا كانت item.Value فارغة، قم بفحص item.Files
            if (!item.Files || item.Files.length === 0) {
              this.toastr.error(
                document.dir == 'rtl'
                  ? 'الرجاء إدخال التعليمات'
                  : 'Please enter instructions'
              );
              return; // إيقاف الفحص فور عثور على قيمة مفقودة
            }
          }
        }

        // إذا لم يتم العثور على قيم مفقودة أو على عناصر بخاصية Files فارغة، قم بفتح الحوار
        const dialogRef = this.dialog
          .open(TCComponent, {
            width: '40vw',
            data: { dataEdit: data },
            disableClose: true,
          })
          .addPanelClass('cmms-custom-modal');

        dialogRef.afterClosed().subscribe((value) => {
          if (value) {
            this.dialogRef.close();
          }
        });
      } else {
        const dialogRef = this.dialog
          .open(TCComponent, {
            width: '40vw',
            data: { dataEdit: data },
            disableClose: true,
          })
          .addPanelClass('cmms-custom-modal');

        dialogRef.afterClosed().subscribe((value) => {
          if (value) {
            this.dialogRef.close();
          }
        });
      }
    } else {
      // إذا كانت this.isForceSOP لا تساوي 1، يمكنك إضافة المزيد من المنطق هنا حسب متطلبات التطبيق
      // على سبيل المثال، يمكنك عرض رسالة أخرى أو تنفيذ إجراء مختلف
      this.toastr.error(
        document.dir == 'rtl'
          ? 'الرجاء إدخال التعليمات'
          : 'Please enter instructions'
      );
    }
  }

  saveClientAcceptance(accept: any) {
    this.service
      .saveClientAcceptance({
        ...this.ClientAcceptanceValue,
        accept: accept,
      })
      .subscribe((value) => {
        if (value) {
          this.dialogRef.close();
          this.service.getAllTask({});
        }
      });
  }

  reOpen(ID: any) {
    this.service.ReOpen({ ids: ID }).subscribe(
      (res: any) => {
        if (res.rv > 0) {
          this.dialogRef.close('save');
        } else {
        }
      },
      (err) => { }
    );
  }

  changeToPending(ID: any) {
    const dialogRef = this.dialog
      .open(ChangeToPendingComponent, {
        width: '60vw',
        data: { ID: ID },
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        this.getTaskDetails();
      }
    });
  }

  nextTask() {
    let data = this.service.DataTasks$.value?.Data;
    let index = data.findIndex(
      (value: any) => value.ID == this.dataCard.filter.Id
    );
    let nextData = data[index + 1];
    if (nextData) {
      this.service.CardOpened = nextData.ID;
      this.dataCard.filter.Id = nextData.ID;
      this.getTaskDetails();
    } else {
      this.toastr.error('this is last task');
    }
  }

  PreviousTask() {
    let data = this.service.DataTasks$.value?.Data;
    let index = data.findIndex(
      (value: any) => value.ID == this.dataCard.filter.Id
    );
    let preData = data[index - 1];
    if (preData) {
      this.service.CardOpened = preData.ID;
      this.dataCard.filter.Id = preData.ID;
      this.getTaskDetails();
    } else {
      this.toastr.error('this is first task');
    }
  }

  getTaskByNo() {
    let data = this.service.DataTasks$.value?.Data;
    let itemSelected = data.find(
      (value: any) => value.InternalNumber == this.TaskNoForSearch.value
    );
    if (itemSelected) {
      this.dataCard.filter.Id = itemSelected.ID;
      this.getTaskDetails();
    } else {
      this.toastr.error('not Found');
    }
  }

  openPPM() {
    const url: string = window.location.href;
    const hostAssets: string =
      url.split('/')[0] +
      '/' +
      url.split('/')[1] +
      '/' +
      url.split('/')[2] +
      '/' +
      `PMs/link/${this.DataEdit?.OrginalPMId}`;
    window.open(hostAssets, '_blank');
  }

  printWorkOrder() {
    this.loadingPrint = true;
    this.service
      .PrintWorkOrder({
        ids: this.DataEdit?.ID,
      })
      .subscribe(
        (value) => {
          this.loadingPrint = false;
        },
        (err) => {
          this.loadingPrint = false;
        }
      );
  }
}
