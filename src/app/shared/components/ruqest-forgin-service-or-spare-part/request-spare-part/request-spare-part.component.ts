import { switchMap } from 'rxjs/operators';
import { CommonService } from './../../../../modules/auth/services/common.service';
import { UntypedFormControl, FormGroup, Validators } from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-request-spare-part',
  templateUrl: './request-spare-part.component.html',
})
export class RequestSparePartComponent implements OnInit {
  PartName = new UntypedFormControl();
  SearchOfParts$: Observable<any>;
  spareParts: any[] = [];
  hideQuantity: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<RequestSparePartComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private commanService: CommonService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    if (this.data?.noQuantity) {
      this.hideQuantity = true;
    }
    this.OnSearch();
  }

  OnSearch() {
    this.SearchOfParts$ = this.PartName.valueChanges.pipe(
      switchMap((value: string) => {
        return value ? this.commanService.search('Parts', value) : of([]);
      })
    );
  }
  onSelectPart(item: any) {
    if (!this.spareParts.find((value) => value.partId == item.Id)) {
      this.spareParts.push({
        ...item,
        partId: item.Id,
        Id: 0,
        stockQty: item.InStockQuantity,
        quantity: 0,
      });
    } else {
      this.toastr.error(
        document.dir == 'rtl' ? ' لا يمكن التكرار' : 'You Can`t Duplicate'
      );
    }
    this.PartName.reset();
  }
  Close() {
    this.dialogRef.close();
  }
  save() {
    if (
      this.spareParts.find((value: any) => value.quantity == 0) &&
      !this.hideQuantity
    ) {
      this.toastr.error(
        document.dir == 'rtl'
          ? 'يرجى ادخال الحقول المطلوبة'
          : 'Enter All Field Required'
      );
    } else {
      this.dialogRef.close(this.spareParts);
    }
  }
  deletePart(ID: any) {
    this.spareParts.forEach((value, index) => {
      if (value.partId == ID) {
        this.spareParts.splice(index, 1);
      }
    });
  }
}
