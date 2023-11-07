import { environment } from 'src/environments/environment';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserAndTeamsModal } from 'src/app/shared/modalsShared/User&TeamsModal/User&TeamsModal.component';
import SignaturePad from 'signature_pad';

@Component({
  selector: 'app-field-request-approve',
  templateUrl: './field-request-approve.component.html',
})
export class FieldRequestApproveComponent implements OnInit, AfterViewInit {
  @Input() valueFieldControl: UntypedFormControl;
  @Input() readOnly: boolean;
  @Input() viewAssigment: boolean;
  @Output() saveValueFeild: EventEmitter<any> = new EventEmitter<any>();
  FormRequestApprove: UntypedFormGroup;
  AssigmentSignatureTeams: any[];
  AssigmentSignatureUsers: any[];
  AssigmentApprovedTeams: any[];
  AssigmentApprovedUsers: any[];
  AssigmentUnApprovedTeams: any[];
  AssigmentUnApprovedUsers: any[];
  @ViewChild('canvas') canvas: ElementRef;
  sig: SignaturePad;
  constructor(public dialog: MatDialog, private fb: UntypedFormBuilder) {
    this.FormRequestApprove = this.fb.group({
      requestAssignmentId: [''],
      approvedAssginmentId: [''],
      disapprovedAssginmentId: [''],
    });
  }
  Avatar=environment.Avatar

  ngOnInit(): void {

    this.FormRequestApprove.patchValue(this.valueFieldControl.value);
    this.AssigmentSignatureTeams =
      this.valueFieldControl.value?.RequestAssignmentTeamTxt || [];
    this.AssigmentSignatureUsers =
      this.valueFieldControl.value?.RequestAssignmentUserTxt || [];
    this.AssigmentApprovedTeams =
      this.valueFieldControl.value?.ApprovedAssignmentTeamTxt || [];
    this.AssigmentApprovedUsers =
      this.valueFieldControl.value?.ApprovedAssignmentUserTxt || [];
    this.AssigmentUnApprovedTeams =
      this.valueFieldControl.value?.DisapprovedAssignmentTeamTxt || [];
    this.AssigmentUnApprovedUsers =
      this.valueFieldControl.value?.DisapprovedAssignmentUserTxt || [];
  }
  ngAfterViewInit(): void {
    if (!this.readOnly) {
      this.sig = new SignaturePad(this.canvas.nativeElement);
    }
  }
  ChoseAssigmentSignature() {
    const dialogRef = this.dialog.open(UserAndTeamsModal, {
      width: '70vw',
      data: {
        name: 'WORKTEAMS.CARDHEADER',
        AssignmentID:
          this.FormRequestApprove.controls['requestAssignmentId'].value,
      },
      disableClose: true,

    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.FormRequestApprove.controls['requestAssignmentId'].setValue(
          result.AssignmentID
        );
        this.AssigmentSignatureTeams = result.itemsCheckedTeams;
        this.AssigmentSignatureUsers = result.itemsCheckedUsers;
        this.valueFieldControl.setValue(this.FormRequestApprove.value);
        this.saveValueFeild.emit();
      }
    });
  }
  ChoseAssigmentApproved() {
    const dialogRef = this.dialog.open(UserAndTeamsModal, {
      width: '70vw',
      data: {
        name: 'WORKTEAMS.CARDHEADER',
        AssignmentID:
          this.FormRequestApprove.controls['approvedAssginmentId'].value,
      },
      disableClose: true,

    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.FormRequestApprove.controls['approvedAssginmentId'].setValue(
          result.AssignmentID
        );
        this.AssigmentApprovedTeams = result.itemsCheckedTeams;
        this.AssigmentApprovedUsers = result.itemsCheckedUsers;
        this.valueFieldControl.setValue(this.FormRequestApprove.value);
        this.saveValueFeild.emit();
      }
    });
  }
  ChoseAssigmentUnApproved() {
    const dialogRef = this.dialog.open(UserAndTeamsModal, {
      width: '70vw',
      data: {
        name: 'WORKTEAMS.CARDHEADER',
        AssignmentID:
          this.FormRequestApprove.controls['disapprovedAssginmentId'].value,
      },
      disableClose: true,

    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.FormRequestApprove.controls['disapprovedAssginmentId'].setValue(
          result.AssignmentID
        );
        this.AssigmentUnApprovedTeams = result.itemsCheckedTeams;
        this.AssigmentUnApprovedUsers = result.itemsCheckedUsers;
        this.valueFieldControl.setValue(this.FormRequestApprove.value);
        this.saveValueFeild.emit();
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
