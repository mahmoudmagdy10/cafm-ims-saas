import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { workOrderService } from '../../workOrder.service';
// import { UserAndTeamsModal } from 'src/app/shared/modalsShared/User&TeamsModal/User&TeamsModal.component';
import { UsersAndTeamsService } from 'src/app/pages/ppm-tasks/modals/filter-for-print-pdf/User&TeamsModal/user&TeamsModal.service';
import { UserAndTeamsModal } from 'src/app/pages/ppm-tasks/modals/filter-for-print-pdf/User&TeamsModal/User&TeamsModal.component';
import { ppmTasksService } from 'src/app/pages/ppm-tasks/ppm-tasks.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-filter-for-print-pdf',
  templateUrl: './filter-for-print-pdf.component.html',
  styleUrls: ['./filter-for-print-pdf.component.scss'],
})
export class FilterForPrintPdfComponent implements OnInit {
  filterReport = new UntypedFormGroup({
    FromDueDate: new UntypedFormControl(),
    ToDueDate: new UntypedFormControl(),
    ReportTitle: new UntypedFormControl('', Validators.required),
  });
  selectedUsers: [] = [];
  itemsCheckedUsers: [] = [];
  constructor(
    public dialogRef: MatDialogRef<FilterForPrintPdfComponent>,
    public service: workOrderService,
    public dialog: MatDialog,
    private usersAndTeamsService: UsersAndTeamsService,
    private ppmTasksService: ppmTasksService,
    private toastr: ToastrService
  ) {}
  ngOnInit(): void {}
  Close() {
    this.dialogRef.close();
  }
  onFilterReport() {
    if (this.filterReport.valid) {
      const payload = {
        isPM: false,
        UserIds: this.itemsCheckedUsers,
        TaskStatusId: 3,
        toDate: this.filterReport.value.ToDueDate,
        fromDate: this.filterReport.value.FromDueDate,
        ReportTitle: this.filterReport.value.ReportTitle,
      };
      this.ppmTasksService
        .getAllReportsWOSOPPrint(payload)
        .subscribe((res) => console.log(6666, res));
      this.dialogRef.close();
    } else {
      this.toastr.error(
        document.dir == 'rtl'
          ? 'يرجى ادخال الحقول المطلوبة'
          : 'Enter All Field Required'
      );
    }
  }
  ArrayToString(data: any) {
    if (data) {
      return data
        .map((value: any) => {
          return value.FirstName;
        })
        .join(' , ');
    }
  }
  openDialog() {
    const dialogRef = this.dialog.open(UserAndTeamsModal, {
      width: '70vw',
      data: {
        name: 'WORKTEAMS.CARDHEADER',
        // AssignmentID: this.selectedUsers.map((user)=> user?.id),
      },
      disableClose: true,
    });
    this.usersAndTeamsService.userSignatures$.subscribe(
      (res: any) => (this.selectedUsers = res?.Data)
    );
    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        this.selectedUsers = data.result;
        this.itemsCheckedUsers = data.itemsCheckedUsers.map(
          (user: any) => user.Code
        );
      }
    });
  }
}
