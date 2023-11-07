import { MenuItem } from 'primeng/api';
import { ToastrService } from 'ngx-toastr';
import { ppmTasksService } from '../../../../ppm-tasks.service';
import { UntypedFormBuilder, UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  OnDestroy,
  HostListener,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { concat, merge, Observable, Subscription, of } from 'rxjs';
import {
  retry,
  skip,
  switchMap,
  catchError,
  map,
  filter,
  tap,
  take,
} from 'rxjs/operators';
import { TreeAssetsComponent } from 'src/app/shared/components/Tree/tree-assets/tree-assets.component';
import { MatDialog } from '@angular/material/dialog';
import { UserAndTeamsModal } from 'src/app/shared/modalsShared/User&TeamsModal/User&TeamsModal.component';
import * as moment from 'moment';
import { Editor } from 'primeng/editor';
import { ChangeToPendingComponent } from 'src/app/pages/work-order/change-to-pending/change-to-pending.component';

@Component({
  selector: 'app-informtion-basic',
  templateUrl: './informtion-basic.component.html',
  styleUrls: ['./informtion-basic.component.scss'],
})
export class InformtionBasicComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  FormTask: UntypedFormGroup;
  Codes$: Observable<any>;
  changeStatusCard$: Observable<any>;
  @Input() dataEdit: any;
  @Input() preview: boolean = false;

  subscribeSelected: Subscription;

  subscribeForEditorChange: Subscription;
  AssetInfo = { label: '', ID: 0 };
  Muints: any = [];
  Hours: any = [];
  pageDirection: string;
  DueDate = new UntypedFormControl();
  PriorityId = new UntypedFormControl();
  TaskStatusId = new UntypedFormControl();
  canEdit: boolean = false;
  @ViewChild('pEditor')
  public editor: Editor;
  TaskDescription = new UntypedFormControl();
  currantImageSize = 25;
  imagesSizes: MenuItem[] = [
    {
      label: '25 %',

      command: () => {
        this.currantImageSize = 25;
      },
    },
    {
      label: '50 %',

      command: () => {
        this.currantImageSize = 50;
      },
    },
    {
      label: '75 %',

      command: () => {
        this.currantImageSize = 75;
      },
    },
    {
      label: '100 %',

      command: () => {
        this.currantImageSize = 100;
      },
    },
  ];
  optionsForEditor: MenuItem[] = [
    {
      label: 'Images Size',
      items: this.imagesSizes,
    },
  ];
  disabledTaskDescription: boolean = false;
  constructor(
    public fb: UntypedFormBuilder,
    private service: ppmTasksService,

    public dialog: MatDialog,
    private toastr: ToastrService
  ) {
    this.FormTask = this.fb.group(
      {
        ID: [''],
        TaskName: [''],
        TaskDescription: [''],
        StartDate: ['', { updateOn: 'change' }],
        // DueDate: [''],
        InternalNumber: [''],
        EstimatedTimeM: [''],
        EstimatedTimeH: [''],
        TaskTypeId: [''],
        TagsId: [''],
        TaskAssignmentId: [],
        // PriorityId: [''],
        AssetId: [''],
        TaskStatusName: [''],
        CreatedByName: [{ value: '', disabled: true }],
        FirstTaskType: [{ value: '', disabled: true }],
        RequesterPhone: [{ value: '', disabled: true }],
      },
      { updateOn: 'blur' }
    );
  }
  ngOnDestroy(): void {
    this.subscribeSelected.unsubscribe();
    this.subscribeForEditorChange.unsubscribe();
  }
  ngAfterViewInit(): void {
    this.canEdit = false;

    this.subscribeForEditorChange = this.TaskDescription.valueChanges.subscribe(
      (value) => {
        this.canEdit = true;
      }
    );

    // this.editor
    //   .getQuill()
    //   .editor.scroll.domNode.addEventListener(
    //     'blur',
    //     this.onBlurEditor.bind(this)
    //   );
  }

  ngOnInit(): void {
    this.changeStatusCard$ = this.service.changeStatusCard$.pipe(
      tap((value) => {
        this.TaskStatusId.patchValue(value);
      })
    );

    this.pageDirection = document.dir;

    for (var i = 0; i <= 59; i++) {
      this.Muints.push(i);
    }
    for (var i = 0; i <= 10; i++) {
      this.Hours.push(i);
    }
    this.Codes$ = this.service.Codes$.pipe(
      map((value) => {
        return {
          ...value,
          TaskStatusId: value.TaskStatusId?.map((value: any) => {
            if (value.code == 2 && !this.service.LocationForUser?.coords) {
              return {
                ...value,
                Name: value?.Name,
                disabled: true,
              };
            } else if (value.code == 5) {
              return { ...value, disabled: true };
            } else {
              return value;
            }
          }),
          TaskTypeId: value.TaskTypeId?.map((value: any) => {
            if (value.Code == 134) {
              return { ...value, disabled: true };
            } else {
              return value;
            }
          }),
        };
      })
    );
    this.Codes$.subscribe((value) => {
      if (value) {
        const perWorkOrder = value.PagePermissions;
        if (!perWorkOrder.WorkOrdersEdit) {
          this.FormTask.disable();
          this.TaskStatusId.disable();
          this.disabledTaskDescription = true;
        }
        if (!perWorkOrder.WorkOrdersPriorityEdit) {
          this.PriorityId.disable();
        }
        if (!perWorkOrder.WorkOrdersDueEdit) {
          this.DueDate.disable();
        }
      }
    });
    this.ReturnDataToForm();
    const Save$ = this.FormTask.valueChanges.pipe(
      switchMap((value: any) => {
        return this.service.addNewTask({
          ...value,
          TagsId: JSON.stringify(value.TagsId),
          EstimatedTime: Math.ceil(
            Number(value.EstimatedTimeH * 60) + Number(value.EstimatedTimeM)
          ),
          StartDate: moment(this.FormTask.get('StartDate')?.value).format(
            'YYYY-MM-DD HH:mm'
          ),
          DueDate: moment(this.DueDate.value).format('YYYY-MM-DD HH:mm'),
          PriorityId: this.PriorityId.value,
          TaskStatusId: this.TaskStatusId.value,
          TaskTypeId: this.FormTask.get('TaskTypeId')?.value,
        });
      })
    );

    const saveNewDueDate$ = this.DueDate.valueChanges.pipe(
      switchMap((value) => {
        return this.service.ChangeDueDate({
          ids: this.dataEdit.ID,
          startDate: moment(this.FormTask.get('StartDate')?.value).format(
            'YYYY-MM-DD HH:mm'
          ),
          dueDate: moment(value).format('YYYY-MM-DD HH:mm'),
        });
      })
    );
    const saveNewPriorityId$ = this.PriorityId.valueChanges.pipe(
      switchMap((value) => {
        return this.service.ChangePriority({
          ids: this.dataEdit.ID,
          priorityId: value,
        });
      })
    );
    const saveNewTaskStatusId$ = this.TaskStatusId.valueChanges.pipe(
      switchMap((value) => {
        return this.service.ChangeStatus({
          ids: this.dataEdit.ID,
          statusId: value,
        });
      })
    );
    this.subscribeSelected = merge(
      Save$,
      saveNewDueDate$,
      saveNewPriorityId$,
      saveNewTaskStatusId$
    ).subscribe(
      (res: any) => {},
      (err) => {}
    );
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
  ReturnDataToForm() {
    this.FormTask.patchValue({
      ...this.dataEdit,
      StartDate: new Date(this.dataEdit.StartDate),
    });
    var hours = Math.floor(this.dataEdit.EstimatedTime / 60);
    var minutes = this.dataEdit.EstimatedTime % 60;
    this.FormTask.controls['EstimatedTimeH'].setValue(hours);
    this.FormTask.controls['EstimatedTimeM'].setValue(minutes);
    this.FormTask.controls['InternalNumber'].disable();
    if (this.dataEdit?.TaskTypeId == 134) {
      this.FormTask.get('TaskTypeId')?.disable();
    }

    this.AssetInfo.label = this.dataEdit.AssetName;
    this.AssetInfo.ID = this.dataEdit.AssetId;
    this.DueDate.setValue(new Date(this.dataEdit.DueDate));
    this.PriorityId.setValue(this.dataEdit.PriorityId);
    this.TaskStatusId.setValue(this.dataEdit.TaskStatusId);
    this.TaskDescription?.setValue(this.dataEdit?.TaskDescription);
    if (this.dataEdit.TaskStatusId == 3 || this.dataEdit.TaskStatusId == 4||this.preview) {
      this.FormTask.disable();
      this.PriorityId.disable();
      this.TaskStatusId.disable();
      this.DueDate.disable();
      this.disabledTaskDescription = true;
    }
  }

  opentree(dataTree: any) {
    const dialogRef = this.dialog.open(TreeAssetsComponent, {
      width: '60vw',
      data: { data: dataTree, AssetInfo: this.AssetInfo || null },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.AssetInfo.label = result.label;
        this.AssetInfo.ID = result.ID;
        this.dataEdit.AssetId = result.ID;
        this.dataEdit.AssetName = result.label;
        this.FormTask.controls['AssetId'].setValue(result.ID);
      }
    });
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
        this.dataEdit.TaskAssignmentTeamTxt = result.itemsCheckedTeams;
        this.dataEdit.TaskAssignmentUserTxt = result.itemsCheckedUsers;
      }
    });
  }
  CalenderOpen(isOpen: boolean) {
    this.service.isCalenderOpenSub.next(isOpen);
  }
  openAsset(ID: any) {
    if (ID) {
      const url: string = window.location.href;

      const hostAssets: string =
        url.split('/')[0] +
        '/' +
        url.split('/')[1] +
        '/' +
        url.split('/')[2] +
        '/' +
        `Asset/card/${ID}`;
      window.open(hostAssets, '_blank');
    } else {
      this.toastr.error(
        document.dir == 'rtl' ? 'يرجى اختيار أصل' : 'Please select assets'
      );
    }
  }
  onBlurEditor($event: any) {
    if (this.canEdit) {
      this.FormTask.get('TaskDescription')?.setValue(
        this.TaskDescription.value
      );
    }
  }
  changeToPending(oldStatus: any, newStatus: any) {
    const dialogRef = this.dialog
      .open(ChangeToPendingComponent, {
        width: '60vw',
        data: { ID: this.dataEdit.ID },
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        this.TaskStatusId.setValue(newStatus);
      } else {
        this.TaskStatusId.setValue(newStatus);
      }
    });
  }
}
