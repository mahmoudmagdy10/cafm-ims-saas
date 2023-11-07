import { FieldManagmentService } from 'src/app/shared/components/FieldManagment/FieldManagment.service';
import { ToastrService } from 'ngx-toastr';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { UntypedFormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { ViewItemInFieldService } from '../view-field-in-item.service';
@Component({
  selector: 'add-field-to-item',
  templateUrl: 'add-field-to-item.component.html',
})
export class AddFieldToItemComponent implements OnInit {
  DataFeild$: Observable<any>;
  constructor(
    public dialogRef: MatDialogRef<AddFieldToItemComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fieldManagmentService: FieldManagmentService,
    private toastr: ToastrService,
    private service: ViewItemInFieldService
  ) {}
  searchField = new UntypedFormControl();
  ArrayFieldsId: any[] = [];
  disabled: boolean = false;
  ngOnInit(): void {
    this.fieldManagmentService.getFeild();
    this.DataFeild$ = this.fieldManagmentService.DataFeild$.pipe(
      tap((value: any[]) => {


        // if (this.data.catergory) {
        //   value.forEach((item, index) => {
        //     if (item.ComponentCategoryId != this.data.catergory) {
        //       item.hide = true;
        //     } else {
        //       item.hide = false;
        //     }
        //   });
        // }
      }),
      map((value: any) => {
        this.disabled = true;
        return value.map((itemField: any) => {
          if (
            this.data.fieldsSelected &&
            this.data.fieldsSelected.find(
              (item: any) => item.FieldId == itemField.ID
            ) != null
          ) {
            return {
              ...itemField,
              checked: true,
              showField: false,
              FieldsOptions: itemField.FieldsOptions
                ? itemField.FieldsOptions.map((value: any) => {
                    return {
                      Code: value.ID,
                      Name: value.OptionName,
                    };
                  })
                : null,
            };
          } else {
            return {
              ...itemField,
              checked: false,
              showField: false,
              FieldsOptions: itemField.FieldsOptions
                ? itemField.FieldsOptions.map((value: any) => {
                    return {
                      Code: value.ID,
                      Name: value.OptionName,
                    };
                  })
                : null,
            };
          }
        });
      })
    );
  }

  checkField(event: any, item: any) {
    if (event.target.checked == true) {
      this.ArrayFieldsId.push({
        fieldId: item.ID,
        value: '',
      });
    } else {
      this.ArrayFieldsId.forEach((value: any, index: any) => {
        if (value.fieldId == item.ID) {
          this.ArrayFieldsId.splice(index, 1);
        }
      });
    }

  }
  onSave() {
    const body = {
      ComponentId: this.data.idItem,
      fieldsData: this.ArrayFieldsId,
    };
    this.service.addFieldToItemLocations(body).subscribe(
      (res: any) => {
        if (res.rv > 0) {

          this.dialogRef.close(res.AssetsFields);
        } else {

        }
      },
      (err) => {

      }
    );
  }
  SaveValueField(idField: any, newValue: any) {
    this.ArrayFieldsId.forEach((item) => {
      if (item.fieldId == idField) {
        item.value = newValue;
      }
    });
  }

  Close() {
    this.dialogRef.close();
  }
}
