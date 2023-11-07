import { environment } from 'src/environments/environment';
import { switchMap, map, tap, finalize, first } from 'rxjs/operators';
import { EventReportingClassificationService } from './../../event-reporting-classification.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { UntypedFormBuilder, FormControl, UntypedFormGroup } from '@angular/forms';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Observable, of, Subscription, merge, forkJoin } from 'rxjs';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { UserAndTeamsModal } from 'src/app/shared/modalsShared/User&TeamsModal/User&TeamsModal.component';

@Component({
  selector: 'add-report',
  templateUrl: './add-report.component.html',
  styleUrls: ['./add-report.component.scss'],
  providers: [DatePipe],
})
export class AddReportComponent implements OnInit, OnDestroy {
  // dialogRef: any;
  Codes$: Observable<any>;
  CommonFieldsByCategoryId$: Observable<any>;
  FormReport: UntypedFormGroup;
  ArrayFieldsNotFile: any[] = [];
  ArrayFieldsFile: any[] = [];
  pageDirection: string;
  Avatar=environment.Avatar
  itemsCheckedTeamsFirstOwner: any[];
  itemsCheckedUsersFirstOwner: any[];
  itemsCheckedTeamsSecondOwner: any[];
  itemsCheckedUsersSecondOwner: any[];
  itemsCheckedTeamsThirdOwner: any[];
  itemsCheckedUsersThirdOwner: any[];

  constructor(
    public dialogRef: MatDialogRef<AddReportComponent>,
    private toastr: ToastrService,
    private service: EventReportingClassificationService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public fb: UntypedFormBuilder,
    public datepipe: DatePipe,
    public dialog: MatDialog,
  ) {
    this.FormReport = this.fb.group({
      ID: [0],
      Title: [''],
      LocationId: [''],
      CategoryId: [0],
      periority: [''],
      department: [''],
      firstOwner: [''],
      secondOwner: [''],
      thirdOwner: [''],
      TaskAssignmentId: [],
    });
  }

  ngOnInit(): void {
    this.dialogRef.disableClose = true;
    this.Codes$ = this.service.getCodeObz$();
    if (this.data) {
      this.FormReport.patchValue({
        ...this.data,
      });
      this.FormReport.controls['CategoryId'].setValue(this.data.CategoryId);
      this.FormReport.controls['firstOwner'].setValue(String(this.data.FirstOwner || ''));
      this.FormReport.controls['secondOwner'].setValue(String(this.data.SecondOwner || ''));
      this.FormReport.controls['thirdOwner'].setValue(String(this.data.thirdOwner || ''));
      this.FormReport.controls['department'].setValue(this.data.Department);
      this.FormReport.controls['periority'].setValue(String(this.data.Periority));
      this.FormReport.controls['CategoryId'].disable();
      this.CommonFieldsByCategoryId$ = of(this.data.Fields);
      if(this.data.FirstOwnerAssignmentUserTxt || this.data.SecondOwnerAssignmentUserTxt || this.data.ThirdOwnerAssignmentUserTxt
        || this.data.FirstOwnerAssignmentTeamTxt || this.data.SecondOwnerAssignmentTeamTxt || this.data.ThirdOwnerAssignmentTeamTxt){
        this.itemsCheckedUsersFirstOwner = this.data.FirstOwnerAssignmentUserTxt;
        this.itemsCheckedUsersSecondOwner = this.data.SecondOwnerAssignmentUserTxt;
        this.itemsCheckedUsersThirdOwner = this.data.ThirdOwnerAssignmentUserTxt;
        this.itemsCheckedTeamsFirstOwner = this.data.FirstOwnerAssignmentTeamTxt;
        this.itemsCheckedTeamsSecondOwner = this.data.SecondOwnerAssignmentTeamTxt;
        this.itemsCheckedTeamsThirdOwner = this.data.ThirdOwnerAssignmentTeamTxt;
      }
    } else {
      this.FormReport.controls['CategoryId'].valueChanges.subscribe((value) => {
        this.service.getCommonFieldsByCategoryId(value);
      });
      this.CommonFieldsByCategoryId$ =
        this.service.getCommonFieldsByCategoryIdObz$();
    }
  }
  dataFields() {
    const Sub = this.CommonFieldsByCategoryId$.subscribe((value) => {
      value?.forEach((value: any) => {

        if (value.FieldType == 5 || value.FieldType == 6) {
          this.ArrayFieldsFile.push({
            FieldId: value.FieldId,
            Value: value.PicturesFile,
          });
        } else {
          this.ArrayFieldsNotFile.push({
            fieldId: value.FieldId,
            value: value.FieldValue,
          });
        }
      });
    });
    Sub.unsubscribe();
  }

  SaveIncidentReports() {
    const body = {
      ...this.FormReport.value,
      CategoryId: this.FormReport.controls['CategoryId'].value,
    };
    const SaveIncidentReports$ = this.service.addIncidentReports(body).pipe(
      switchMap((res: any) => {
        var bodyFieldsNotFile = null,
          $arrFileField: any[] = [];
        this.dataFields();
        if (this.ArrayFieldsNotFile.length > 0) {
          bodyFieldsNotFile = {
            ComponentId: res.rv,
            fieldsData: this.ArrayFieldsNotFile,
          };
        }
        if (this.ArrayFieldsFile.length > 0) {
          $arrFileField = [];
          this.ArrayFieldsFile.forEach((value) => {
            const bodyFieldsFile = {
              ComponentId: res.rv,
              ...value,
            };
            $arrFileField.push(
              this.service.addFieldFileIncidentReports(bodyFieldsFile)
            );
          });
        }
        const SaveNotFile$ = bodyFieldsNotFile
          ? this.service.addFieldIncidentReports(bodyFieldsNotFile)
          : of([]);

        return res
          ? $arrFileField.length > 0
            ? merge(SaveNotFile$, forkJoin($arrFileField))
            : merge(SaveNotFile$)
          : of([]);
      })
    );
    SaveIncidentReports$.pipe(
      finalize(() => {
        this.dialogRef.close('onSave');
      })
    ).subscribe(
      (res: any) => {

        if (res.rv > 0) {


        } else {
          if (res.Msg) {

          }
        }
      },
      (err) => {

      }
    );
  }
  Close() {
    this.dialogRef.close();
  }

  convertFileToBase64(file: any, index: number) {

    const Obz$ = this.CommonFieldsByCategoryId$.pipe(
      tap((value) => {
        file.forEach((element: any) => {

          value[index].PicturesFile.push(element);
          var reader = new FileReader();
          reader.readAsDataURL(element);
          reader.onload = (_event) => {
            value[index].PicturesBase64.push(reader.result);
          };
        });
      })
    ).subscribe();
    Obz$.unsubscribe();
  }
  ngOnDestroy(): void {
    if (!this.data) {
      const CommonFieldsByCategoryId: Subscription =
        this.CommonFieldsByCategoryId$.pipe(
          tap((value: any[]) => {
            if (value && value.length > 0) {
              value.forEach((element) => {
                element.FieldValue = '';
                element.PicturesFile = [];
                element.PicturesBase64 = [];
              });
            }
          })
        ).subscribe();
      CommonFieldsByCategoryId.unsubscribe();
    }
  }
  removeFile(indexField: number, indexFieldPic: number) {
    const CommonFieldsByCategoryId: Subscription =
      this.CommonFieldsByCategoryId$.pipe(
        tap((value: any[]) => {
          value[indexField].PicturesFile.splice(indexFieldPic, 1);
          value[indexField].PicturesBase64.splice(indexFieldPic, 1);
        })
      ).subscribe();
    CommonFieldsByCategoryId.unsubscribe();
  }

  openDialog(proparity: string) {
    const dialogRef = this.dialog.open(UserAndTeamsModal, {
      width: '70vw',
      data: {
        name: 'WORKTEAMS.CARDHEADER',
        AssignmentID: this.FormReport.controls[proparity].value,
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.FormReport.controls[proparity].setValue(
          result.AssignmentID
        );
        if(proparity == 'firstOwner'){
          this.itemsCheckedTeamsFirstOwner = result.itemsCheckedTeams;
          this.itemsCheckedUsersFirstOwner = result.itemsCheckedUsers;
        }
        if(proparity == 'secondOwner'){
          this.itemsCheckedTeamsSecondOwner = result.itemsCheckedTeams;
          this.itemsCheckedUsersSecondOwner = result.itemsCheckedUsers;
        }
        if(proparity == 'thirdOwner'){
          this.itemsCheckedTeamsThirdOwner = result.itemsCheckedTeams;
          this.itemsCheckedUsersThirdOwner = result.itemsCheckedUsers;
        }
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
