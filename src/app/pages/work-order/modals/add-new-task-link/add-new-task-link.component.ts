import { ActivatedRoute } from '@angular/router';
import { skip, tap } from 'rxjs/operators';
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
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { workOrderService } from '../../workOrder.service';
import { MatDialog } from '@angular/material/dialog';
import { UserAndTeamsModal } from 'src/app/shared/modalsShared/User&TeamsModal/User&TeamsModal.component';
import * as moment from 'moment';

@Component({
  templateUrl: './add-new-task-link.component.html',
})
export class AddNewTaskByLinkComponent implements OnInit {
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
    private toastr: ToastrService,
    public fb: UntypedFormBuilder,
    private service: workOrderService,
    public dialog: MatDialog,
    private route: ActivatedRoute
  ) {
    this.FormTask = this.fb.group({
      TaskName: ['', [Validators.required]],
      TaskDescription: [''],
      StartDate: [new Date()],
      DueDate: [, [Validators.required]],
      TaskAssignmentId: [],
      EstimatedTimeM: [''],
      EstimatedTimeH: [''],
      TaskTypeId: [62, [Validators.required]],
      AssetId: [''],
      TagsId: [''],
      PriorityId: ['', [Validators.required]],
      TaskStatusId: [1, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.pageDirection = document.dir;
    this.route.queryParams.subscribe((params) => {
      this.AssetSelected = params.AssetName;
      this.FormTask.controls['AssetId'].setValue(params.AssetId);
    });
    this.service.getCodePreventiveTasks();
    this.Codes$ = this.service.Codes$.pipe(
      tap((value) => {

        if (value) {
          this.FormTask.get('DueDate')?.setValue(
            new Date(value.DueDate.DefaultDueDate)
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
