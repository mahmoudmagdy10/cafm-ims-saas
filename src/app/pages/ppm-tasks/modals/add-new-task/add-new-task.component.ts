import { tap, map } from 'rxjs/operators';
import { TreeAssetsComponent } from 'src/app/shared/components/Tree/tree-assets/tree-assets.component';
import { Observable, Subscription } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import {
  UntypedFormBuilder,
  FormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Component, OnInit, Inject,  } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserAndTeamsModal } from 'src/app/shared/modalsShared/User&TeamsModal/User&TeamsModal.component';
import * as moment from 'moment';
import { ppmTasksService } from '../../ppm-tasks.service';

@Component({
  selector: 'app-copy-setting',
  templateUrl: './add-new-task.component.html',
})
export class AddNewTaskComponent implements OnInit {
  // dialogRef: any;
  Codes$: Observable<any>;
  AssetSelected: string = '';
  subscribeSelected: Subscription;
  itemsCheckedTeams: any[];
  itemsCheckedUsers: any[];
  FormTask: UntypedFormGroup;
  Muints: any = [];
  Hours: any = [];
  pageDirection: string;
  minDate: any = new Date();
  constructor(
    public dialogRef: MatDialogRef<AddNewTaskComponent>,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public fb: UntypedFormBuilder,
    private service: ppmTasksService,

    public dialog: MatDialog
  ) {
    this.FormTask = this.fb.group({
      TaskName: ['', [Validators.required]],
      TaskDescription: [''],
      StartDate: [new Date()],
      DueDate: [, [Validators.required]],
      TaskAssignmentId: [],
      EstimatedTimeM: ['0'],
      EstimatedTimeH: ['0'],
      TaskTypeId: [62, [Validators.required]],
      AssetId: [''],
      TagsId: [''],
      PriorityId: ['', [Validators.required]],
      TaskStatusId: [1, [Validators.required]],
    });
  }
  get TaskTypeId() {
    return this.FormTask.get('TaskTypeId')?.value.Code;
  }
  ngOnInit(): void {
    this.dialogRef.disableClose = true;
    // this.dialogRef.backdropClick().subscribe((_) => {
    //   if (confirm('do you want leave this page?')) {
    //     this.Close();
    //   }
    // });
    this.pageDirection = document.dir;

    this.Codes$ = this.service.Codes$.pipe(
      map((value) => {
        return {
          ...value,
          TaskTypeId: value.TaskTypeId.map((value: any) => {
            if (value.Code == 134) {
              return { ...value, disabled: true };
            } else {
              return value;
            }
          }),
        };
      }),
      tap((value: any) => {
        if (value) {
          this.FormTask.get('DueDate')?.setValue(
            new Date(value?.DueDate?.DefaultDueDate)
          );
        }
      })
    );
    for (var i = 0; i <= 59; i++) {
      this.Muints.push(i);
    }
    for (var i = 0; i <= 10; i++) {
      this.Hours.push(i);
    }
  }

  opentree(Assets: any) {
    const dialogRef = this.dialog.open(TreeAssetsComponent, {
      width: '50vw',
      data: { data: Assets },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.AssetSelected = result.AssetName;
        this.FormTask.controls['AssetId'].setValue(result.ID);
      }
    });
  }

  addNewTask() {
    if (this.FormTask.valid) {
      if (
        this.FormTask.controls['StartDate'].value &&
        moment(this.FormTask.controls['StartDate'].value).isSameOrAfter(
          this.FormTask.controls['DueDate'].value
        )
      ) {
        this.toastr.error('Due date cannot be less than the start date');
      } else {
        const body = {
          ...this.FormTask.value,
          StartDate: moment(this.FormTask.controls['StartDate'].value).format(
            'YYYY-MM-DD HH:mm'
          ),
          DueDate: moment(this.FormTask.controls['DueDate'].value).format(
            'YYYY-MM-DD HH:mm'
          ),
          TagsId: JSON.stringify(this.FormTask.controls['TagsId'].value),
          EstimatedTime: Math.ceil(
            +this.FormTask.controls['EstimatedTimeH'].value * 60 +
              +this.FormTask.controls['EstimatedTimeM'].value
          ),
        };

        this.service.addNewTask(body).subscribe(
          (res: any) => {
            if (res.rv > 0) {
              this.dialogRef.close({
                ...res,
                TaskDescription: this.FormTask.get('TaskDescription')?.value,
              });
            } else {
            }
          },
          (err) => {}
        );
      }
    } else {
      this.toastr.error(
        document.dir == 'rtl'
          ? 'يرجى ادخال الحقول المطلوبة'
          : 'Enter All Field Required'
      );
    }
  }
  Close() {
    this.dialogRef.close();
  }
  openDialog() {
    const dialogRef = this.dialog.open(UserAndTeamsModal, {
      width: '70vw',
      data: {
        name: 'WORKTEAMS.CARDHEADER',
        AssignmentID: this.FormTask.controls['TaskAssignmentId'].value,
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.FormTask.controls['TaskAssignmentId'].setValue(
          result.AssignmentID
        );
        this.itemsCheckedTeams = result.itemsCheckedTeams;
        this.itemsCheckedUsers = result.itemsCheckedUsers;
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
