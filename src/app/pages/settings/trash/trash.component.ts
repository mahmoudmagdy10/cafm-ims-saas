import {
  finalize,
  catchError,
  shareReplay,
  switchMap,
  mergeMap,
} from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { UntypedFormControl } from '@angular/forms';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { RecycleBinService } from './trash.service';
@Component({
  selector: 'trash',
  templateUrl: './trash.compnent.html',
  styleUrls: ['trash.compnent.scss'],
})
export class trashComponent implements OnInit {
  constructor(
    private service: RecycleBinService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {}
  Codes$: Observable<any>;
  DataRecycleBin$: Observable<any>;
  loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  Category = new UntypedFormControl();
  tableNameSelected: string;
  idDelete: any;
  DataRecycleBin: any[] = [];
  ngOnInit() {
    this.Codes$ = this.service.getCodeRecycleBin();
    // this.Category.valueChanges.subscribe(value => {
    //
    //   this.tableNameSelected = value;
    //   this.loading$.next(true)
    //   this.DataRecycleBin$ = this.service.getRecycleBin({ TableName: value }).pipe(shareReplay(1),catchError(() => {
    //
    //     this.toastr.error("خطا غير معروف");
    //     return of();

    //   }), finalize(() => {
    //     this.loading$.next(false)
    //   }));
    // })
    this.DataRecycleBin$ = this.Category.valueChanges.pipe(
      switchMap((value: any) => {
        this.tableNameSelected = value;
        this.loading$.next(true);

        return this.service.getRecycleBin({ TableName: value }).pipe(
          catchError(() => {
            return of();
          }),
          finalize(() => {
            this.loading$.next(false);
          })
        );
      })
    );
    this.DataRecycleBin$.subscribe((value) => {
      this.DataRecycleBin = value;
    });
  }

  onDeleteFinaly() {
    this.loading$.next(true);

    const body = {
      action: false,
      tableName: this.tableNameSelected,
      id: this.idDelete,
    };
    this.service.ActionRecycleBin(body).subscribe(
      (res: any) => {
        if (res.rv > 0) {
          this.DataRecycleBin.forEach((element: any, index: any) => {
            if (element.ID == this.idDelete) {
              this.DataRecycleBin.splice(index, 1);
            }
          });

          this.loading$.next(false);
        } else {
        }
      },
      (err) => {
        this.loading$.next(false);
      }
    );
  }
  onReturn(id: any) {
    this.loading$.next(true);
    const body = {
      action: true,
      tableName: this.tableNameSelected,
      id: id,
    };
    this.service.ActionRecycleBin(body).subscribe(
      (res: any) => {
        if (res.rv > 0) {
          this.DataRecycleBin.forEach((element: any, index: any) => {
            if (element.ID == id) {
              this.DataRecycleBin.splice(index, 1);
            }
          });

          this.loading$.next(false);
        } else {
        }
      },
      (err) => {
        // this.toastr.error('خطا غير معروف');
      }
    );
  }
  loadingValue$() {
    return this.loading$.asObservable();
  }
}
