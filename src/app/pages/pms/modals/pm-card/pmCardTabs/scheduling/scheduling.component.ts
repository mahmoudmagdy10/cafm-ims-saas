import { ToastrService } from 'ngx-toastr';
import { UntypedFormBuilder } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { schedules } from '../../../schedules/schedules.component';
import { PmsService } from 'src/app/pages/pms/pms.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-scheduling',
  templateUrl: './scheduling.component.html',
  styleUrls: ['./scheduling.component.scss'],
})
export class SchedulingComponent implements OnInit {
  @Input() itemEdit: any;
  CodeObz$: Observable<any>;
  DateAndTime$!: Observable<any>;
  currentDateTime: Date;
  constructor(
    public dialog: MatDialog,
    private fb: UntypedFormBuilder,
    private service: PmsService,
    private toastr: ToastrService
  ) {}
  idDeleted: any;
  ngOnInit(): void {
    this.service.getDate();
    this.DateAndTime$ = this.service.DateAndTime$.pipe(
      tap((val) => {
        this.currentDateTime = new Date(val);
      })
    );
    this.CodeObz$ = this.service.CodeObz$;
  }
  schedules(item?: any) {
    const dialogRef = this.dialog
      .open(schedules, {
        width: '60vw',
        data: item,
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        if (!this.itemEdit.PMSchedules) {
          this.itemEdit.PMSchedules = [];
        }
        if (!this.itemEdit.PMScheduletTime) {
          this.itemEdit.PMScheduletTime = [];
        }

        this.itemEdit.PMSchedules.push(value);
        // this.itemEdit.PMScheduletTime.push(value.PMScheduleTimes);
        this.service.getSchedulesTimeByPMSID(this.itemEdit.ID);

        this.service.RunCurrentPPM({
          currDate: this.currentDateTime,
        });
      }
    });
  }
  deleteSchedules() {
    this.service.deleteSchedules(this.idDeleted).subscribe((res: any) => {
      if (res.rv > 0) {
        this.service.getSchedulesTimeByPMSID(this.itemEdit.ID);

        this.itemEdit.PMSchedules.forEach((element: any, index: any) => {
          if (element.ID == this.idDeleted) {
            this.itemEdit.PMSchedules.splice(index, 1);
          }
        });
      } else {
      }
    });
  }
}
