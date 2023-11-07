import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FieldManagmentService } from '../FieldManagment.service';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-select-parent-field',
  templateUrl: './select-parent-field.component.html',
  styleUrls: ['./select-parent-field.component.scss']
})
export class SelectParentFieldComponent implements OnInit {
  dataFeilds$: Observable<any>;
  selectedFieldId: number = 0;
  selectedField: any = null;
  selctedValueOption: string = '';
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SelectParentFieldComponent>,
    public service: FieldManagmentService,
    private toastr: ToastrService) { }
  dataFields: any[] = [];
  ngOnInit(): void {
    this.dataFeilds$ = this.service.dataFeilds$;
    this.dataFeilds$.subscribe((fields) => {
      this.dataFields = fields.filter((field: any) => field?.FieldTypeId == "7");
    });
  }

  Close() {
    this.dialogRef.close();
  }
  selectParent(field: any) {
    this.selectedFieldId = field.ID;
    this.selectedField = field;
    this.selctedValueOption = '';
  }
  handleSelectOptionValue(event: any) {
    if (event.value)
      this.selctedValueOption = event.value;
  }
  Save() {
    const payload = {
      LocationId: String(this.selectedField.LocationId),
      ComponentId: String(this.data.field.ID),
      ParentId: String(this.selectedFieldId),
      ParentValue: this.selctedValueOption,
    }
    this.service.AddParentField(payload).subscribe((res: any) => {
      if (res?.Msg) {
        this.Close()
      }
    }, (error) => {
      this.toastr.error(error?.Msg)
    })
  }
}
