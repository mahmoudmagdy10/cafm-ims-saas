import { Subscription } from 'rxjs/internal/Subscription';
import { FieldManagmentService } from './../FieldManagment.service';
import { tap, finalize } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { UntypedFormControl } from '@angular/forms';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-categories-managment',
  templateUrl: './categories-managment.component.html',
})
export class CategoriesManagmentAccidentComponent implements OnInit, OnDestroy {
  constructor(
    public service: FieldManagmentService,
    private tostar: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CategoriesManagmentAccidentComponent>
  ) {}

  Codes$: Observable<any>;
  CategoriesName = new UntypedFormControl();
  IDFieldDeleted: number;
  IndexFieldDeleted: number;
  unsubscribe: Subscription[] = [];
  ngOnInit(): void {
    this.Codes$ = this.service.CodeObz$;
  }

  addCategories(Name: string, ID: any) {
    if (Name.trim() != '')
      this.service.AddCategories(Name.trim(), ID).subscribe((res: any) => {
        if (res.rv > 0) {
          const unSubscri = this.Codes$.pipe(
            tap((value: any) => {
              if (
                value.Categories &&
                !value.Categories.find((c: any) => c.code == ID)
              ) {
                value.Categories.push({
                  name: Name,
                  code: res.rv,
                });
              }
            })
          ).subscribe();
          this.unsubscribe.push(unSubscri);
          this.CategoriesName.reset();
          // this.tostar.success(res.Msg);
          // this.data.Categories.push({
          //   name: this.CategoriesName.value,
          //   code: res.rv,
          // });
        } else {
          this.tostar.error(res.msg);
        }
      });
  }
  onDelete() {
    this.service
      .DeleteCategories({ ID: this.IDFieldDeleted })
      .subscribe((res: any) => {
        if (res.rv > 0) {
          const unSubscri = this.Codes$.pipe(
            tap((value: any) => {
              value.Categories.splice(this.IndexFieldDeleted, 1);
            })
          ).subscribe();
          this.unsubscribe.push(unSubscri);
          // this.data.Categories.splice(this.IndexFieldDeleted, 1);
          this.tostar.success(res.Msg);
        } else {
          this.tostar.error(res.Msg);
        }
      });
  }
  Close() {
    this.dialogRef.close();
  }
  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
