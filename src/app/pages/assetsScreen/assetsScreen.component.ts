import { AuthService } from './../../modules/auth/services/auth.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { TableAssetsComponent } from './table-assets/ViewAsTable/table-assets.component';
import { FilterAssetsComponent } from './filter-assets/filter-assets.component';
import { MatDialog } from '@angular/material/dialog';
import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
import { Observable } from 'rxjs';
import { assetsScreenService } from './assetsScreen.service';
import { addAssetsComponent } from './addAssets/addAssets.component';
import { map, tap, retry, skip } from 'rxjs/operators';
import { RefreshAssetsService } from './table-assets/refresh-assets.service';
import { ViewItemInFieldService } from 'src/app/shared/components/ViewFieldInItem/view-field-in-item.service';
import { FieldManagmentService } from 'src/app/shared/components/FieldManagment/FieldManagment.service';
import { FieldManagmentComponent } from 'src/app/shared/components/FieldManagment/FieldManagment.component';
import { ViewDataFilterService } from 'src/app/shared/components/view-data-filter/view-data-filter.service';

@Component({
  selector: 'assetsScreen',
  templateUrl: './assetsScreen.component.html',
  styleUrls: ['./assetsScreen.component.scss'],
})
export class assetsScreenComponent implements OnInit, OnDestroy, AfterViewInit {
  codes$: Observable<any>;
  code: any;
  ViewWay: number = 2;
  @ViewChild('TableAssets') TableAssets: TableAssetsComponent;
  feildsViewInTable: any[] = [];
  interval: any;
  subscription: Subscription;
  subscriptionForDataFilter: Subscription;
  DataFeild$: Observable<any>;
  assetsSettings$: Observable<any>;
  constructor(
    public assetsService: assetsScreenService,
    public dialog: MatDialog,
    private auth: AuthService,
    private RefreshAssets: RefreshAssetsService,
    private addFieldService: ViewItemInFieldService,
    public fieldManagmentService: FieldManagmentService,
    private _viewDataFilterService: ViewDataFilterService
  ) {}

  ngOnInit(): void {
    this.assetsService.dataForMapSub.next([]);
    this.assetsSettings$ = this.assetsService.dataTableAssets$.pipe(
      map((value) => {
        return value ? value.Setting[0] : {};
      })
    );
    this.assetsService.getCodeAssets();
    this.addFieldService.ComponentType = 'Assets';
    this.fieldManagmentService.ComponentType = 'Assets';
    this.fieldManagmentService.getFeild();

    this.getCodes();
    this.Refresh();
    this.DataFeild$ = this.fieldManagmentService.DataFeild$.pipe(
      tap((value) => {})
    );
    this.assetsService.getAssetsForDisplayMap();
    this.assetsService.CodesAssetTree();
  }
  ngAfterViewInit(): void {
    this.subscriptionForDataFilter = this._viewDataFilterService
      .SelectorFilterByComponent$('Asset', 'dataFilter')
      .pipe(skip(1))
      .subscribe((value) => {
        this.RefreshAssets.doAction$('');
      });
  }
  Refresh() {
    this.subscription = this.auth.getonTimer().subscribe((value: any) => {
      if (this.interval) {
        clearInterval(this.interval);
      }

      let TimerRefresh = localStorage.getItem('TimerRefresh');

      if (TimerRefresh != '0' && TimerRefresh != 'now' && TimerRefresh) {
        this.interval = setInterval(() => {
          this.RefreshAssets.doAction$('tree');
          this.assetsService.getAssetsForDisplayMap();
          this.assetsService.getCodeAssets();
        }, +TimerRefresh);
      } else if (value == 'now') {
        this.RefreshAssets.doAction$('tree');
        this.assetsService.getAssetsForDisplayMap();
        this.assetsService.getCodeAssets();
      }
    });
  }
  getCodes() {
    this.codes$ = this.assetsService.codes$.pipe(
      tap((value) => {
        if (value) {
          this.code = value;
          this.fieldManagmentService.ChangeCode$ = this.code;
        }
      })
    );

    // ParentId: this.assetsService.mapTree(code.ParentId),
  }

  // fieldsManagment() {
  //   this.fieldManagmentService.ComponentType = 'IncidentReports';
  //   const dialogRef = this.dialog
  //     .open(FieldManagmentComponent, {
  //       width: '60vw',
  //     })
  //     .addPanelClass('cmms-custom-modal');

  //   dialogRef.afterClosed().subscribe((result) => {
  //
  //   });
  // }
  fieldsManagment() {
    const dialogRef = this.dialog
      .open(FieldManagmentComponent, {
        width: '60vw',
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');

    dialogRef.afterClosed().subscribe((result) => {});
  }

  openAddAsset(isLocation?: boolean) {
    const dialogRef = this.dialog
      .open(addAssetsComponent, {
        width: '60vw',
        disableClose: true,
        data: { isLocation: isLocation },
      })

      .addPanelClass('cmms-custom-modal');
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.RefreshAssets.doAction$();
      }
    });
  }

  AddFilter() {
    const dialogRef = this.dialog
      .open(FilterAssetsComponent, {
        width: '65vw',
        data: {
          code: { ...this.code },
          filters:
            this._viewDataFilterService.datafilterModel?.Asset?.dataFilter
              ?.params,
        },
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.TableAssets.Filters = result;
        this.TableAssets.selectedPage = 1;
        this.RefreshAssets.doAction$('');
      }
    });
  }
  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.subscription?.unsubscribe();
    this.subscriptionForDataFilter.unsubscribe();
  }
  export() {
    this.TableAssets.exportToExcel();
  }
}
