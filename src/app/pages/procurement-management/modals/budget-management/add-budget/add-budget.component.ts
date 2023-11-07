import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { UserAndTeamsModal } from './../../../../../shared/modalsShared/User&TeamsModal/User&TeamsModal.component';
import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ProcurementManagementService } from '../../../procurement-management.service';
import { AddImageBudgetComponent } from './add-image-budget/add-image-budget.component';

@Component({
  selector: 'add-budget',
  templateUrl: 'add-budget.component.html',
})
export class AddBudget implements OnInit {
  budgetForm: UntypedFormGroup;
  PoCheckedTeams = [];
  PoCheckedUsers = [];
  BillCheckedTeams = [];
  BillCheckedUsers = [];
  image: any;
  Avatar = environment.Avatar;
  croppedImage = './assets/media/avatars/avatar.svg';
  imageBudget: { fileToReturn: any } = {
    fileToReturn: '',
  };
  constructor(
    public dialogRef: MatDialogRef<AddBudget>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private fb: UntypedFormBuilder,
    private service: ProcurementManagementService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {
    this.budgetForm = this.fb.group({
      ID: [],
      BudgetName: ['', Validators.required],
      Credit: ['', Validators.required],
      BudgetDescription: [],
      PoAssignmentId: [],
      BillAssignmentId: [],
    });
    if (this.data) {
      this.budgetForm.patchValue(this.data);
      if (this.data.ImagePath) {
        this.croppedImage = this.Avatar + this.data.ImagePath;
      } else {
        this.croppedImage = './assets/media/avatars/avatar.svg';
      }
      this.BillCheckedTeams = this.data.BillAssignmentTeamTxt;
      this.BillCheckedUsers = this.data.BillAssignmentUserTxt;
      this.PoCheckedTeams = this.data.POAssignmentTeamTxt;
      this.PoCheckedUsers = this.data.POAssignmentUserTxt;
    }
  }

  ngOnInit(): void {}

  Close() {
    this.dialogRef.close();
  }

  ArrayToString(arr: any) {
    if (arr) {
      return arr
        .map((value: any) => {
          return value.Name;
        })
        .join(' , ');
    }
  }
  choosePOAssigment() {
    const dialogRef = this.dialog.open(UserAndTeamsModal, {
      width: '70vw',
      data: {
        name: 'WORKTEAMS.CARDHEADER',
        AssignmentID: this.budgetForm.controls['PoAssignmentId'].value,
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.budgetForm.controls['PoAssignmentId'].setValue(
          result.AssignmentID
        );
        this.PoCheckedTeams = result.itemsCheckedTeams;
        this.PoCheckedUsers = result.itemsCheckedUsers;
      }
    });
  }
  chooseBillAssigment() {
    const dialogRef = this.dialog.open(UserAndTeamsModal, {
      width: '70vw',
      data: {
        name: 'WORKTEAMS.CARDHEADER',
        AssignmentID: this.budgetForm.controls['BillAssignmentId'].value,
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.budgetForm.controls['BillAssignmentId'].setValue(
          result.AssignmentID
        );
        this.BillCheckedTeams = result.itemsCheckedTeams;
        this.BillCheckedUsers = result.itemsCheckedUsers;
      }
    });
  }
  // saveImg(id: any) {
  //   if(this.imageBudget.fileToReturn){
  //         const body = {
  //     ID: id,
  //     Image: this.imageBudget.fileToReturn,
  //   };
  //   this.service.addImage(body).subscribe(
  //     (_) => {
  //       this.service.getBudget();
  //     },
  //     (err) => {
  //       this.service.getBudget();
  //     }
  //   );
  //   }else{
  //     this.service.getBudget();
  //   }

  // }
  AddBudget() {
    if (this.budgetForm.valid) {
      this.service.addBudget(this.budgetForm.value).subscribe(
        (res: any) => {
          if (res.rv > 0) {

            // this.saveImg(res.rv);
            this.service.getBudget();
            this.dialogRef.close('onSave');
          } else {

          }
        },
        (err) => {


        }
      );
    } else {
      this.toastr.error(
        document.dir == 'rtl'
          ? 'يرجى ادخال الحقول المطلوبة'
          : 'Enter All Field Required'
      );
    }
  }

  openChooseImage() {
    const dialogRef = this.dialog.open(AddImageBudgetComponent, {
      width: '50vw',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.imageBudget = result;
        this.croppedImage = result.croppedImage;
        this.cdr.detectChanges();
      }
    });
  }
}
