import { environment } from 'src/environments/environment';
import { FieldManagmentService } from 'src/app/shared/components/FieldManagment/FieldManagment.service';
import { RefreshAssetsService } from './../refresh-assets.service';
import { ViewAsTreeComponent } from './../view-as-tree/view-as-tree.component';
import { treeService } from '../../../../shared/components/Tree/tree.service';
import { addAssetsComponent } from './../../addAssets/addAssets.component';
import { cardAssetsModalComponent } from '../../cardAsset/cardAssetByModal/cardAssetModal.component';
import { assetsScreenService } from './../../assetsScreen.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { map, finalize, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';
import {
  Component,
  Input,
  OnInit,
  ChangeDetectorRef,
  ViewChild,
  AfterViewInit,
  ElementRef,
} from '@angular/core';
import { ExportTOExcelShared } from 'src/app/shared/ExportTableToExcel';

@Component({
  selector: 'app-table-assets',
  templateUrl: './table-assets.component.html',
  styles: [
    `
      :host .pi-angle-double-left:hover,
      .pi-angle-double-right:hover {
        background-color: #009ef7;
        color: #fff;
      }
    `,
  ],
  providers: [treeService],
})
export class TableAssetsComponent implements OnInit, AfterViewInit {
  @Input() feildsViewInTable: any[];
  @Input() code: any;
  @Input() ViewWay: any;
  @ViewChild('viewAsTree') viewAsTree: ViewAsTreeComponent;
  @ViewChild('viewAsTreeHor') viewAsTreeHor: ViewAsTreeComponent;

  @ViewChild('TABLE') table: ElementRef;
  loading = new BehaviorSubject<boolean>(false);
  Assets$: Observable<any>;
  assetIdDeleted: any;
  listPagination: any[] = [];
  selectedPage = 1;
  AssetsSelected: any[] = [];
  Assets: any[] = [];
  checkedAll: boolean = false;
  Filters: any;
  dataTree: any;
  DataFeild$: Observable<any> = of([]);
  TableExcel$: Observable<any> = of([]);
  Avatar = environment.Avatar;
  RowCount$: Observable<any> = of([]);

  floatsltr: boolean = false;
  floatsrtl: boolean = false;
  constructor(
    public assetsService: assetsScreenService,
    private toster: ToastrService,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private RefreshAssets: RefreshAssetsService,
    public fieldManagmentService: FieldManagmentService,
    private _treeService: treeService
  ) {}
  ngAfterViewInit(): void {
    this.RowCount$ = this.assetsService.dataTableAssets$.pipe(
      map((value) => {
        return value ? value.Setting[0].RowCount : {};
      })
    );

    this.checkedAll = false;
    this.RefreshAssets.RefreshAction$.subscribe((action:any) => {
      const params = {
        CurrentPage: this.selectedPage,
        ...this.Filters,
      };
      this.assetsService.getAssets();
      this.viewAsTree.getTree();
      if (action == 'tree') {
        this.viewAsTree.getTree();
      }
    });
  }

  ngOnInit(): void {
    this.UnSelectedItem();
    this.getAssets();
    this.DataFeild$ = this.fieldManagmentService.DataFeild$.pipe(
      tap((value) => {})
    );

    if (document.dir == 'rtl') {
      this.floatsrtl = true;
    } else {
      this.floatsltr = true;
    }
  }
  getAssets() {
    this.Assets$ = this.assetsService.DataTableAssets$.pipe(
      tap((data) => {
        if (data) {
          this.checkedAll = true;
          data.Data.forEach((item: any) => {
            if (this.AssetsSelected.find((value) => value.ID == item.ID)) {
              item.checked = true;
            } else {
              item.checked = false;
              this.checkedAll = false;
            }
          });
        }
      })
    );
    this.Assets$.subscribe((Data) => {
      if (Data) {
        this.listPagination = [];
        for (var i = 1; i <= Data.Setting[0].TotalPage; i++) {
          this.listPagination.push(i);
        }
        this.Assets = Data.Data;
      }
    });
  }
  deleteAsset() {
    this.assetsService.deleteAsset(this.assetIdDeleted).subscribe(
      (res: any) => {
        if (res.rv > 0) {
          this.RefreshAssets.doAction$();
        } else {
          this.toster.error(res.Msg);
        }
      },
      (err) => {
        this.toster.error(err.Msg);
      }
    );
  }
  assetCard(item: any) {
    if (this.code?.PagePermissions?.AssetsCard) {
      const dialogRef = this.dialog
        .open(cardAssetsModalComponent, {
          width: '85vw',
          maxWidth: '85vw',
          data: {
            ID: item.ID,
          },
          disableClose: true,
        })
        .addPanelClass('cmms-custom-modal');

      dialogRef.afterClosed().subscribe((result) => {
        this.cdr.detectChanges();
      });
    }
  }
  AddChildAsset(Parent: any) {
    const dialogRef = this.dialog
      .open(addAssetsComponent, {
        width: '60vw',
        data: Parent,
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.RefreshAssets.doAction$();
      }
    });
  }
  selectPage(PageCount: any) {
    if (PageCount == 'next') {
      this.selectedPage = this.selectedPage + 1;
    } else if (PageCount == 'back') {
      this.selectedPage = this.selectedPage - 1;
    } else if (PageCount == 'backAll') {
      this.selectedPage = 1;
    } else if (PageCount == 'nextAll') {
      this.selectedPage = this.listPagination.length;
    } else {
      this.selectedPage = PageCount;
    }
    this.assetsService.selectedPage = this.selectedPage;
    this.RefreshAssets.doAction$();
  }
  selectAsset(event: any, item: any, index: number) {
    if (event.target.checked == true) {
      this.AssetsSelected.push(item);
      this.Assets[index].checked = true;
    } else {
      this.AssetsSelected.forEach((value, index) => {
        if (value.ID == item.ID) {
          this.AssetsSelected.splice(index, 1);
        }
      });
      this.Assets[index].checked = false;
    }
  }

  UnSelectedItem() {
    this.assetsService.UnSelectedItemSubject$.subscribe((itemUnSelected) => {
      this.Assets.forEach((value) => {
        if (value.ID == itemUnSelected.ID) {
          value.checked = false;
          this.cdr.detectChanges();
        }
      });
    });
  }
  ValueField(idFeildsViewInTable: any, AssetsFields: any) {
    if (AssetsFields) {
      for (var i = 0; i < AssetsFields.length; ) {
        if (AssetsFields[i].FieldId == idFeildsViewInTable) {
          return AssetsFields[i].FieldValue;
        } else {
          i = i + 1;
        }
      }
    }
  }
  CheckAll(event: any) {
    if (event.target.checked == true) {
      this.Assets.forEach((item) => {
        if (item.checked == false) {
          this.AssetsSelected.push(item);
          item.checked = true;
        }
      });
    } else {
      this.Assets.forEach((item) => {
        if (item.checked == true) {
          this.AssetsSelected.forEach((value, index) => {
            if (value.ID == item.ID) {
              this.AssetsSelected.splice(index, 1);
            }
          });
          item.checked = false;
        }
      });
    }
  }
  get loading$() {
    return this.loading.asObservable();
  }
  ClearSelected() {
    this.AssetsSelected = [];
  }
  exportToExcel() {
    this.TableExcel$ = this.assetsService.getDataForExcel(this.Filters).pipe(
      tap((value) => {
        setTimeout(() => {
          ExportTOExcelShared(this.table.nativeElement);
        }, 300);
      })
    );
  }
  moveOnWorkOrderForAsset(ID: any) {
    let url =
      window.location.href.split('Asset')[0] +
      '/WorkOrder/workOrderNotCompleted?AssetId=' +
      ID;
    window.open(url, '_blank');
  }
  // selectPageFirst() {
  //   this.selectedPageChange.emit((this.selectedPage = 1));
  // }
  // selectPageFinal() {
  //   this.selectedPageChange.emit(this.listPagination.length);
  //   console.log('', this.listPagination.length);
  // }
}
