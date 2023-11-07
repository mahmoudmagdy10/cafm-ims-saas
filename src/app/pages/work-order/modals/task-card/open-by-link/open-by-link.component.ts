import { TCComponent } from './../modalsCard/TC/TC.component';
import { ChangeToPendingComponent } from 'src/app/pages/work-order/change-to-pending/change-to-pending.component';
import { ActivatedRoute, Router } from '@angular/router';
import { map, tap, shareReplay } from 'rxjs/operators';
import { workOrderService } from '../../../workOrder.service';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import {
  Component,
  OnInit,
  HostListener,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { TimeConsumingComponent } from './../modalsCard/time-consuming/time-consuming.component';
import { MaintenanceTimeComponent } from './../TabsCard/maintenance-time/maintenance-time.component';
import { CompleteNewTask } from './../modalsCard/complete-new-task/complete-new-task.component';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { LogsByComponentTypeService } from 'src/app/shared/components/logs-by-component-type/logs-by-component-type.service';

@Component({
  selector: 'app-open-by-link',
  templateUrl: './open-by-link.component.html',
  styleUrls: ['./open-by-link.component.scss'],
})
export class OpenByLinkComponent implements OnInit {
  taskEdit$: Observable<any>;
  codes$: Observable<any>;
  TaskStatusId: any;
  idTask: any;
  loadingPrint: boolean = false;
  constructor(
    private toastr: ToastrService,
    private service: workOrderService,
    public dialog: MatDialog,
    private _activatedRoute: ActivatedRoute,
    private router: Router,
    private _logsByComponentTypeService: LogsByComponentTypeService
  ) {}
  @ViewChild('maintenanceTime') maintenanceTime: MaintenanceTimeComponent;
  ngOnInit(): void {
    this.idTask = this._activatedRoute.snapshot.paramMap.get('id');
    this.getTaskDetails();
    this.service.getCodePreventiveTasks();
    this.codes$ = this.service.Codes$;
  }
  getTaskDetails() {
    let CompletedType =
      this._activatedRoute.snapshot.queryParamMap.get('CompletedType');
    this.taskEdit$ = this.service
      .getTaskByID({ ID: this.idTask, CompletedType: CompletedType })
      .pipe(
        tap((value) => {
          this.TaskStatusId = value.Data[0].TaskStatusId;
          this.service.WorkOrderOpened = value.Data[0];
          this.service.getInStruction();
          this._logsByComponentTypeService?.startUse(
            'workOrders',
            value.Data[0]?.ID
          );
        }),
        map((value) => {
          return {
            ...value.Data[0],
            TagsId: JSON.parse(value.Data[0]?.TagsId),
          };
        })
      )
      .pipe(shareReplay(1));
  }
  timeConsuming(Open?: boolean) {
    if (this.TaskStatusId == 3) {
    } else {
      this.maintenanceTime.pauseTimer();

      if (+this.maintenanceTime.display.split(':')[1] > 5 || Open) {
        const dialogRef = this.dialog
          .open(TimeConsumingComponent, {
            width: '30vw',
            data: {
              Min: +this?.maintenanceTime?.display.split(':')[1],
              H: +this?.maintenanceTime?.display.split(':')[0],
              ID: this?.idTask,
            },
            disableClose: true,
          })
          .addPanelClass('cmms-custom-modal');
        dialogRef.afterClosed().subscribe((result) => {
          if (!Open) {
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
      }
    }
  }

  CompleteNewTask(data: any) {
    // const dialogRef = this.dialog
    //   .open(CompleteNewTask, {
    //     width: '40vw',
    //     data: { dataEdit: data, type: 'complete' },
    //     disableClose: true,
    //   })
    //   .addPanelClass('cmms-custom-modal');
    // dialogRef.afterClosed().subscribe((value) => {
    //   if (value) {
    //   }
    // });
    this.service.InstructionCompleted({ ID: this.idTask }).subscribe(
      (res: any) => {
        if (res.rv > 0) {
          this.router.navigateByUrl('/WorkOrder/workOrderCompleted');
        } else {
        }
      },
      (err) => {}
    );
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
      }
    });
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
  @ViewChild('Report') Report!: ElementRef<HTMLImageElement>;

  print() {
    html2canvas(this.Report.nativeElement).then((canvas) => {
      const imgData = canvas.toDataURL('image/jpeg');

      const pdf = new jsPDF({
        orientation: 'portrait',
      });

      const imageProps = pdf.getImageProperties(imgData);

      const pdfw = pdf.internal.pageSize.getWidth();

      const pdfh = (imageProps.height * pdfw) / imageProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfw, pdfh);

      pdf.save('output.pdf');
    });
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
  TC(data: any) {
    const dialogRef = this.dialog
      .open(TCComponent, {
        width: '40vw',
        data: { dataEdit: data },
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        this.getTaskDetails();
      }
    });
  }
  printWorkOrder() {
    this.loadingPrint = false;
    this.service
      .PrintWorkOrder({
        ids: this.idTask,
      })
      .subscribe(
        (val: any) => {
          if (val.rv > 0) {
            this.loadingPrint = false;
          } else {
            this.loadingPrint = false;
          }
        },
        (err: any) => {
          this.loadingPrint = false;
        }
      );
  }
}
