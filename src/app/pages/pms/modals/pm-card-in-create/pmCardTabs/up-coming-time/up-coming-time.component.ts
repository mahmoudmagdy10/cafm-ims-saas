import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Component, Input, OnInit } from '@angular/core';
import { PmsService } from 'src/app/pages/pms/pms.service';

@Component({
  selector: 'app-up-coming-time-copy',
  templateUrl: './up-coming-time.component.html',
  styleUrls: ['./up-coming-time.component.scss'],
})
export class UpComingTimeCopyComponent implements OnInit {
  @Input() itemEdit: any;
  CodeObz$: Observable<any>;
  PMScheduletTime$: Observable<any>;
  constructor(private service: PmsService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.PMScheduletTime$ = this.service.SchedulesTimeByPMSID$;
    this.CodeObz$ = this.service.CodeObz$;
  }
  deleteSchedulesTime(ID: any) {
    this.service.deleteSchedulesTime(ID).subscribe((res: any) => {
      if (res.rv > 0) {
        // this.service.getSchedulesTimeByPMSID(this.service.PMSIdOpened);
      } else {
      }
    });
  }
  PMScheduleTimesToWorkOrder(ID: any) {
    this.service.PMScheduleTimesToWorkOrder(ID).subscribe((res: any) => {
      if (res.rv > 0) {
        this.service.getSchedulesTimeByPMSID(this.service.PMSIdOpened);
      } else {
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
  openLink(ID: any) {
    const url: string = window.location.href;

    let host =
      url.split('/')[0] +
      '/' +
      url.split('/')[1] +
      '/' +
      url.split('/')[2] +
      '/' +
      `WorkOrder/card/${ID}`;
    window.open(host, '_blank');
  }
}
