import { tap, finalize } from 'rxjs/operators';
import {
  merge,
  forkJoin,
  of,
  BehaviorSubject,
  Subject,
  Observable,
} from 'rxjs';
import { environment } from 'src/environments/environment';
import { UntypedFormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ViewItemInFieldService } from 'src/app/shared/components/ViewFieldInItem/view-field-in-item.service';
import { Component, Input, OnInit, ChangeDetectorRef, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddFieldToItemComponent } from './AddFieldToItem/add-field-to-item.component';
import { HistoryFieldComponent } from './HistoryField/HistoryField.Component';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { MaintenanceRequestService } from 'src/app/public/maintenance-request/maintenance-request.service';

@Component({
  selector: 'app-view-field-in-item',
  templateUrl: './view-field-in-item.component.html',
  styleUrls: ['./view-field-in-item.component.scss'],
})
export class ViewFieldInItemComponent implements OnInit, OnChanges {
  storedFieldsArray: any = [];
  fileFeildData: any;
  @Input() dataItem: any;
  @Input() havePermission: boolean = true;
  @Input() hiddenLabels: boolean;
  @Input() disable: any;
  @Input() IsNotChangeValue: boolean;
  @Input() catergoryId: any;
  Avatar = environment.Avatar;
  @Input() inPublic: boolean = false;
  FieldIdDeleted: number;
  dataFiles: any;
  setClear = new Subject<any>();
  isMaintenanceRequestUrl: boolean = false;
  clear$: Observable<any> = this.setClear.asObservable();
  constructor(
    private dialog: MatDialog,
    private service: ViewItemInFieldService,
    private toastr: ToastrService,
    private _activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private maintenanceRequestService: MaintenanceRequestService
  ) {}
  fieldSearch = new UntypedFormControl();
  ngOnInit(): void {
    this.maintenanceRequestService.submited$.subscribe((res: any)=> {
      if(res) {
        this.saveFileFields(res);
      }
    });
    if(this.router.url.split('/')[2] == 'MaintenanceRequest') {
      this.isMaintenanceRequestUrl = true;
    }else{
      this.isMaintenanceRequestUrl = false;
    }
    if(this.hiddenLabels)
      this.dataItem.Fields = this.dataItem.Fields.map((field: any) => !field.Parent ? field : {...field, isDisabled: true })
  }
  ngOnChanges(changes: SimpleChanges): void {
  }
  addFeild() {
    const dialogRef = this.dialog.open(AddFieldToItemComponent, {
      width: '50vw',
      data: {
        idItem: this.dataItem.ID,
        fieldsSelected: this.dataItem.Fields,
        catergory: this.catergoryId,
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        result.forEach((value: any) => {
          if (!this.dataItem.Fields) {
            this.dataItem.Fields = [];
          }
          this.dataItem.Fields.push(value);
        });
      }
    });
  }

  SaveNewValue(idField: any, newValue: any) {
    if(this.hiddenLabels){
      const childField1 = this.dataItem?.Fields?.filter((field: any)=> idField === field?.Parent);
      const parentFeild = this.dataItem?.Fields?.find((option: any)=> idField == option?.FieldId)
      const parentValue = parentFeild?.FieldOptions?.find((field: any)=> field?.Code === newValue)?.Name;

      childField1.forEach((child: any)=> {
        if(parentValue == child?.Parentvalue){
          this.dataItem.Fields = this.dataItem?.Fields?.map((field: any)=> {
            if(child.FieldId === field.FieldId){
              return { ...field, isDisabled: false };
            }
            return field;
          });
        }else{
          this.dataItem.Fields = this.dataItem?.Fields?.map((field: any)=> {
            if(child.FieldId === field.FieldId){
              return { ...field, isDisabled: true };
            }
            return field;
          });
        }
      })

      this.dataItem?.Fields.map((item: any) => {
        const matchingObject = this.dataItem?.Fields.find((obj: any) => (obj?.FieldId === item?.Parent) && obj?.isDisabled);
        if (matchingObject) {
          // Modify the properties of the item based on the matching object
          item.isDisabled = true;
        }
      });
    }
    if (!this.inPublic) {
      const body = {
        ComponentId: this.dataItem.ID,
        fieldsData: [
          {
            fieldId: idField,
            value: newValue,
          },
        ],
      };
      this.service.addFieldToItem(body).subscribe(
        (res: any) => {
          if (res.rv > 0) {
          } else {
          }
        },
        (err) => {}
      );
    }
    this.cdr.detectChanges();
  }
  SaveNewValueFile(item: any, newValue: any, index?: any) {
    item.loading=true
    const workRequestId = this._activatedRoute.snapshot.paramMap.get('id');
    const body = {
      ComponentId: this.dataItem.ID,
      FieldId: item?.FieldId,
      Value: newValue,
    };

    this.fileFeildData = {
      ComponentId: this.dataItem.ID,
      FieldId: item?.FieldId,
      Value: newValue,
    }
    this.saveFileFields(undefined,item)
  }
  saveFileFields(workRequestId?: any,item?:any){
    if (!this.inPublic) {
      this.service.addFieldFileToItem(this.fileFeildData).subscribe(
        (res: any) => {
          if (res.rv > 0) {
            res.output.Data.forEach((element: any) => {
              this.dataItem.Fields[0].Files?.push(element);
            });
            this.dataFiles = {filedId: res.output?.FieldId, value: res?.output?.Data[0]?.FilePath};
            item.loading=false
          } else {
          }
        },
        (err) => {}
      );
    }else{
      this.service.addFieldFileToItemInPublic({ ...this.fileFeildData, WorkOrderId: workRequestId }).subscribe(
        (res: any) => {
          if (res.rv > 0) {
            this.dataFiles = {filedId: res.output?.FieldId, value: res?.output?.Data[0]?.FilePath};
          } else {
          }
        },
        (err) => {}
      );
    }
  }
  ArrayFieldsFile: any = [];
  ArrayFieldsNotFile: any = [];
  reOrderFields() {
    this.dataItem.Fields.forEach((value: any) => {
      if (value.FieldType == 5 || value.FieldType == 6) {
        this.ArrayFieldsFile.push({
          FieldId: value.FieldId,
          Value: value.FieldValue,
        });
      } else {
        if(!value.isDisabled){
          this.ArrayFieldsNotFile.push({
            fieldId: value.FieldId,
            value: value.FieldValue,
          });
        }
      }
    });
  }
  saveAllInPublic(ID: any, WorkOrderId: any) {
    var bodyFieldsNotFile = null,
      $arrFileField: any[] = [];
    this.reOrderFields();
    if (this.ArrayFieldsNotFile.length > 0) {
      bodyFieldsNotFile = {
        ComponentId: ID,
        fieldsData: this.ArrayFieldsNotFile,
      };
    }
    if (this.ArrayFieldsFile.length > 0) {
      $arrFileField = [];
      this.ArrayFieldsFile.forEach((value: any) => {
        const bodyFieldsFile = {
          ComponentId: ID,
          WorkOrderId: WorkOrderId,

          ...value,
        };
        $arrFileField.push(
          this.service.addFieldFileToItemInPublic(bodyFieldsFile)
        );
      });
    }
    const SaveNotFile$ = bodyFieldsNotFile
      ? this.service.addFieldToItem(bodyFieldsNotFile)
      : of([]);

    return (
      ID
        ? $arrFileField.length > 0
          ? merge(SaveNotFile$, forkJoin($arrFileField))
          : merge(SaveNotFile$)
        : of([])
    ).pipe(
      finalize(() => {
        this.clearFields();
      })
    );
  }

  saveWorkRequestFields(ID: any, WorkOrderId: any) {
    const workRequestId = this._activatedRoute.snapshot.paramMap.get('id');
    const all = this._activatedRoute.snapshot.paramMap;
    var bodyFieldsNotFile = null,
      $arrFileField: any[] = [];
    this.reOrderFields();
    if (this.ArrayFieldsNotFile.length > 0) {
      bodyFieldsNotFile = {
        ComponentId: ID,
        workRequestId,
        fieldsData: [this.dataFiles, ...this.ArrayFieldsNotFile],
      };
    }
    if (this.ArrayFieldsFile.length > 0) {
      $arrFileField = [];
      this.ArrayFieldsFile.forEach((value: any) => {
        const bodyFieldsFile = {
          ComponentId: ID,
          WorkOrderId: WorkOrderId,

          ...value,
        };
        // $arrFileField.push(
        //   this.service.addFieldFileToItemInPublic(bodyFieldsFile)
        // );
      });
    }
    const SaveNotFile$ = bodyFieldsNotFile
      ? this.service.addFieldToItemInWrokRequest(bodyFieldsNotFile)
      : of([]);

    return (
      ID
        ? $arrFileField.length > 0
          ? merge(SaveNotFile$, forkJoin($arrFileField))
          : merge(SaveNotFile$)
        : of([])
    ).pipe(
      finalize(() => {
        this.clearFields();
      })
    );
  }

  clearFields() {
    this.setClear.next('clear');
  }
  archiveValues(ID: any, type: any) {
    const dialogRef = this.dialog.open(HistoryFieldComponent, {
      width: '50vw',
      data: { ComponentId: this.dataItem.ID, FieldId: ID, FieldType: type },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }
  deleteFieldInAsset() {
    this.service
      .deleteFieldInItem({
        ComponentId: this.dataItem.ID,
        FieldId: this.FieldIdDeleted,
      })
      .subscribe(
        (res: any) => {
          if (res.rv > 0) {
            this.dataItem.Fields.forEach((value: any, index: any) => {
              if (value.FieldId == this.FieldIdDeleted) {
                this.dataItem.Fields.splice(index, 1);
              }
            });
          } else {
          }
        },
        (err) => {
          this.toastr.error(err.Msg);
        }
      );
  }
  ChangeFieldShown(index: number, IsShown: boolean, IDField: any) {
    this.service
      .ChangeFieldShown({
        ComponentId: this.dataItem.ID,
        FieldId: IDField,
        isShown: !IsShown,
      })
      .subscribe(
        (res: any) => {
          if (res.rv > 0) {
            this.dataItem.Fields[index].IsShown = !IsShown;
          } else {
          }
        },
        (err) => {
          this.toastr.error(err.Msg);
        }
      );
  }
}
