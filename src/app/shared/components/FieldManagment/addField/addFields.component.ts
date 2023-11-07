import { finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs/internal/Subscription';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Inject,
  OnDestroy,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FieldManagmentService } from '../FieldManagment.service';

@Component({
  selector: 'addFields',
  templateUrl: './addFields.component.html',
  styleUrls: ['./../FielsManagment.component.scss'],
})
export class addFieldsAccidentComponent implements OnInit, OnDestroy {
  IdFieldSelected: number = 1;
  FieldTypeDisabled: boolean = false;
  IDField: any;
  numitem: number = 1;
  codes: any;
  Dataitem: Array<{ OptionName: string; OptionOrder: any }> = [];
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  subscri: Subscription;
  formAddField = new UntypedFormGroup({
    Name: new UntypedFormControl(null, [Validators.required]),
    ComponentCategoryId: new UntypedFormControl(false, [Validators.required]),
    FieldTypeId: new UntypedFormControl(1),
    IsUnique: new UntypedFormControl(false),
    AutoAdded: new UntypedFormControl(false),
    ReplacedInChildren: new UntypedFormControl(false),
    DisplayedInTasks: new UntypedFormControl(false),
    IsShown: new UntypedFormControl(false),
    ReminderDaysBefore: new UntypedFormControl(0),
    IsShowInGrid: new UntypedFormControl(false),
  });

  formAddItem = new UntypedFormGroup({
    item: new UntypedFormControl(null),
  });
  constructor(
    public service: FieldManagmentService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<addFieldsAccidentComponent>
  ) {}

  cols: any[];

  ngOnInit(): void {
    this.subscri = this.service.CodeObz$.subscribe((codes:any) => {
      this.codes = codes;
      codes.FieldTypes.forEach((value: any) => {
        value.checked = false;
      });

      if (this.data.id != 0) {
        this.isLoading$.next(true);
        const ob$ = this.service.getFeildById(this.data.id);
        const Sub = ob$
          .pipe(
            finalize(() => {
              Sub.unsubscribe();
            })
          )
          .subscribe((data: any) => {
            this.formAddField.patchValue(data[0]);
            this.FieldTypeDisabled = false;
            this.selectFieldType(data[0].FieldTypeId);
            this.FieldTypeDisabled = true;
            this.IDField = data[0].ID;
            this.cdr.detectChanges();
            this.Dataitem = data[0].FieldsOptions || [];
            this.isLoading$.next(false);
          });
      } else {
        codes.FieldTypes[0].checked = true;
        this.FieldTypeDisabled = false;
        this.formAddField.reset();
        this.IDField = 0;
      }

      this.cols = [
        { field: 'optionName', header: 'الاسم' },
        { field: 'actiom', header: 'الإجراء' },
      ];
    });
  }

  CheckedRemmeber(evt: any) {
    if (evt.target.checked) {
      this.formAddField.controls['ReminderDaysBefore'].enable();
    } else {
      this.formAddField.controls['ReminderDaysBefore'].disable();
    }
  }
  Additem(v: any) {
    if (this.formAddItem.get('item')?.value != null) {
      this.Dataitem.push({
        OptionName: v.value,
        OptionOrder: this.numitem,
      });
      this.numitem++;

      this.formAddItem.reset();
    } else {
      this.toastr.error('يرجى إدخال القيمة المتاحة');
    }
  }

  onDeleteData(index: any) {
    this.Dataitem.splice(index, 1);
    this.numitem--;

  }
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.Dataitem, event.previousIndex, event.currentIndex);
  }

  selectFieldType(code: any) {
    if (!this.FieldTypeDisabled) {
      this.codes.FieldTypes.forEach((value: any) => {
        value.checked = false;
      });
      this.codes.FieldTypes.forEach((value: any) => {
        if (value.code == code) {
          value.checked = true;
          this.IdFieldSelected = value.code;
        }
      });
    }
  }

  addFields() {


    if (this.formAddField.valid) {
      this.Dataitem.forEach((value: any, index: any) => {
        this.Dataitem[index].OptionOrder = index;
      });

      const body = {
        ...this.formAddField.value,
        fieldsOptions: this.Dataitem,
        FieldTypeId: this.IdFieldSelected,
        ID: this.IDField,
        LocationId: localStorage.getItem('defaultLocation'),
        ComponentType: 'Assets',
      };



      this.service.addCommonFeild(body).subscribe(
        (res: any) => {
          if (res.rv > 0) {

            this.Close('Close&refrech');
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

  Loading$() {
    return this.isLoading$.asObservable();
  }

  Close(event?: string) {
    this.dialogRef.close(event);
  }
  ngOnDestroy(): void {
    this.subscri.unsubscribe();
  }
}
