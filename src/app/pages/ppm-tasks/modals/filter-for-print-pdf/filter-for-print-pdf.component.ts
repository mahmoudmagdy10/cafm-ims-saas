import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ppmTasksService } from '../../ppm-tasks.service';
import { UserAndTeamsModal } from './User&TeamsModal/User&TeamsModal.component';
import { UsersAndTeamsService } from './User&TeamsModal/user&TeamsModal.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-filter-for-print-pdf',
  templateUrl: './filter-for-print-pdf.component.html',
  styleUrls: ['./filter-for-print-pdf.component.scss'],
})
export class FilterForPrintPdfComponent implements OnInit {
  selectedUsers: [] = [];
  itemsCheckedUsers: [] = [];
  filterReport = new UntypedFormGroup({
    FromDueDate: new UntypedFormControl(),
    ToDueDate: new UntypedFormControl(),
    description: new UntypedFormControl(),
    ReportTitle: new UntypedFormControl('', Validators.required),
  });
  constructor(
    public dialogRef: MatDialogRef<FilterForPrintPdfComponent>,
    public service: ppmTasksService,
    public dialog: MatDialog,
    private usersAndTeamsService: UsersAndTeamsService,
    private toastr: ToastrService
  ) {}
  ngOnInit(): void {}
  Close() {
    this.dialogRef.close();
    this.usersAndTeamsService.userSignatures = [];
  }
  onFilterReport() {
    // this.dialogRef.close({ ...this.filterReport.value });
    if (this.filterReport.valid) {
      const payload = {
        isPM: true,
        UserIds: this.itemsCheckedUsers,
        TaskStatusId: 3,
        toDate: this.filterReport.value.ToDueDate,
        fromDate: this.filterReport.value.FromDueDate,
        ReportTitle: this.filterReport.value.ReportTitle,
      };
      this.service
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
