import { Observable } from 'rxjs';
import { UserAndTeamsModal } from 'src/app/shared/modalsShared/User&TeamsModal/User&TeamsModal.component';
import { ToastrService } from 'ngx-toastr';
import { PmsService } from 'src/app/pages/pms/pms.service';
import { MatDialog } from '@angular/material/dialog';
import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { CreateTaskForTemplateSop } from '../../modals/create-task/create-task.component';
import { TemplatesForSopService } from '../../TemplatesForSop.service';

@Component({
  selector: 'app-ViewTableForTemplateSOPComponent',
  templateUrl: './view-table.component.html',
})
export class ViewTableForTemplateSOPComponent implements OnInit {
  IDDeleted: any;
  @Output() openCard = new EventEmitter<any>();
  @Output() openCardTabUpComing = new EventEmitter<any>();
  selectedPage = 1;
  RowCountList: any = 50;
  CodeObz$: Observable<any>;
  pmsData$: Observable<any>;
  constructor(
    public dialog: MatDialog,
    private service: TemplatesForSopService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.CodeObz$ = this.service.CodeObz$;

    this.pmsData$ = this.service.AllPmsObz$;
  }

  CreateTask(ID: any, AssignmentID: any) {
    const dialogRefAssimgment = this.dialog.open(UserAndTeamsModal, {
      width: '70vw',
      data: {
        name: 'WORKTEAMS.CARDHEADER',
        AssignmentID: AssignmentID,
      },
    });

    dialogRefAssimgment.afterClosed().subscribe((result) => {
      if (result) {
        this.service
          .createWorkOrder({ pmId: ID, taskAssignmentId: result.AssignmentID })
          .subscribe((value: any) => {
            let Msg = value.Msg.split('->')[1].split(':')[0];
            const dialogRef = this.dialog
              .open(CreateTaskForTemplateSop, {
                width: '30vw',
                disableClose: true,
                data: { Msg: Msg },
              })
              .addPanelClass('cmms-custom-modal');
          });
      }
    });
  }
  deletePMS() {
    this.service.deletePMS(this.IDDeleted).subscribe((res: any) => {
      if (res.rv > 0) {
        this.service.getAllPms();
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
  changePage() {
    this.service.selectedPage = this.selectedPage;
    this.service.getAllPms();
  }
  selectedRowCount(RowCountList: any) {
    this.RowCountList = RowCountList;
    this.service.RowCountList = RowCountList;
    this.service.getAllPms();
  }
}
