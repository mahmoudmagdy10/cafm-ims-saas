import { Observable } from 'rxjs';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { workOrderService } from 'src/app/pages/work-order/workOrder.service';

@Component({
  selector: 'app-fields-as-asset-id',
  templateUrl: './fields-as-asset-id.component.html',
  styleUrls: ['./fields-as-asset-id.component.scss'],
})
export class FieldsAsAssetIdToTemplateComponent implements OnInit {
  dataFieldAsAssetID$: Observable<any>;
  fieldSelected:number
  constructor(
    public dialogRef: MatDialogRef<FieldsAsAssetIdToTemplateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: workOrderService
  ) {}

  ngOnInit(): void {
    this.dataFieldAsAssetID$ = this.service.getFieldAsAssetID(
      this.data.assetID,
      this.data.fieldType
    );
  }
  checkFieldType(fieldSelected: number) {
    this.fieldSelected = fieldSelected;
  }
  onSave(){
    this.dialogRef.close(this.fieldSelected)
  }
  Close() {
    this.dialogRef.close();
  }
}
