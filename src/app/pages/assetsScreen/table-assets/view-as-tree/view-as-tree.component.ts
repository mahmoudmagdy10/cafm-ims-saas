import { addPMTask } from './../../../pms/modals/addPMTask/addPMTask.component';
import { RefreshAssetsService } from './../refresh-assets.service';
import { addAssetsComponent } from './../../addAssets/addAssets.component';
import { MatDialog } from '@angular/material/dialog';
import { cardAssetsModalComponent } from '../../cardAsset/cardAssetByModal/cardAssetModal.component';
import { treeService } from '../../../../shared/components/Tree/tree.service';
import { map, finalize, tap, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {
  Component,
  Input,
  ChangeDetectorRef,
  OnInit,
  ElementRef,
  AfterContentChecked,
  EventEmitter,
  Output,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { assetsScreenService } from '../../assetsScreen.service';
import { PmsService } from 'src/app/pages/pms/pms.service';
import { UntypedFormControl } from '@angular/forms';
import { confirmDeleteComponent } from 'src/app/shared/confirmDelete/confirmDelete.component';

@Component({
  selector: 'app-view-as-tree',
  templateUrl: './view-as-tree.component.html',
  styleUrls: ['./view-as-tree.component.scss'],
  providers: [treeService],
})
export class ViewAsTreeComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild('confirmdeleteWorkOrder')
  confirmdeleteWorkOrder: confirmDeleteComponent;
  RefreshAction$: Observable<any>;
  codes$: Observable<any>;
  code: any;
  constructor(
    private treeService: treeService,
    private assetsService: assetsScreenService,
    public dialog: MatDialog,
    private RefreshAssets: RefreshAssetsService,
    private cdr: ChangeDetectorRef,
    private PmsService: PmsService,

    private el: ElementRef
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialPerants']) {
      this.getTree();
    }
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      const mh = this.el.nativeElement?.querySelector('.p-tree');
      const mh1 = mh?.querySelectorAll('.p-treenode');
      mh1?.forEach((value: any) => {
        const mh2 = value.querySelector('.TESTTest');
        const mh3 = value?.querySelector('.p-treenode-content');
        if (mh2?.getAttribute('isAsset') == 'false') {
          mh3.style.backgroundColor = 'rgb(102 169 237 / 23%)';
          mh3.style.marginTop = '10px';
          mh3.style.transition = 'margin-top 0.5s ease';
        } else {
          // mh3.style.backgroundColor = 'white';
          mh3.style.backgroundColor = 'rgb(102 169 237 / 10%)';
          mh3.style.marginTop = '10px';
          mh3.style.transition = 'margin-top 0.5s ease';
        }
      });
    }, 1500);
  }

  ngOnInit(): void {
    this.PmsService.getCodePms();
    this.getTree();

    this.codes$ = this.assetsService.codes$.pipe(
      tap((value) => {
        this.code = value;
      })
    );
  }

  AssetsTree$: Observable<any>;
  dataTree: any[];
  selected: any;
  loading: boolean = false;
  loadingTree: boolean = false;
  @Input() ParentID: any;
  @Input() LocationId: any;

  @Input() layout: any;
  @Input() FormDynamicField: boolean = false;
  @Input() showFilter: boolean = false;
  @Input() RefreshAfterAdd: boolean = false;

  @Input() selectionMode: string = '';
  @Input() configApi: any = {
    apiGetTree: '/Assets/Tree',
    apiGetChildren: '/Assets/Treev1',
  };
  @Input() initialPerants: any;

  @Input() setting: any;
  @Input() permission: any;
  @Input() isOutSideActionSelect: any;
  @Input() isLocationInAdd: boolean = false;
  @Output() ActionAfterAdd = new EventEmitter();

  @Output() outSideActionSelect = new EventEmitter();

  selectedFile: any;
  AssetName = new UntypedFormControl(null);
  blockedPanel: boolean = false;
  get AssetNameValue() {
    return this.AssetName.value;
  }
  getTree() {
    if (!this.initialPerants) {
      this.loadingTree = true;
      this.AssetsTree$ = this.assetsService.getAssetsTree(
        this.configApi,
        this.ParentID,
        this.LocationId,
        { AssetName: this.AssetNameValue }
      );

      this.AssetsTree$.pipe(
        finalize(() => {
          this.loadingTree = false;
        })
      ).subscribe((value) => {
        this.setting = value.setting;
        this.dataTree = this.treeService.mapTree(value?.Data);
        this.cdr.detectChanges();
      });
    } else {
      this.dataTree = this.initialPerants;
    }
  }
  onEnterSearch(event: any) {
    event.preventDefault(); // منع السلوك الافتراضي لمفتاح Enter
    this.getTree();
  }

  onNodeSelect(event: any) {
    if (!this.isOutSideActionSelect) {
      if (this.code?.PagePermissions?.AssetsCard) {
        this.assetCard(event.ID);
      }
    } else {
      this.outSideActionSelect.emit(event);
    }
  }
  assetCard(ID: any) {
    const dialogRef = this.dialog
      .open(cardAssetsModalComponent, {
        width: '85vw',
        maxWidth: '85vw',
        data: {
          ID: ID,
        },
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');

    dialogRef.afterClosed().subscribe((result) => {
      this.RefreshAssets.doAction$('tree');
    });
  }
  AddChildAsset(ParentData: any) {
    const dialogRef = this.dialog
      .open(addAssetsComponent, {
        width: '60vw',
        data: { ParentData: ParentData, isLocation: this.isLocationInAdd },
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');

    dialogRef.afterClosed().subscribe((item) => {
      if (item) {
        let child = {
          ...item,
          label:
            item?.AssetName +
            ' (' +
            this.code?.Categories.find(
              (value: any) => value.code == item.CategoryId
            )?.name +
            ') ',
          key: item?.AssetName,
          data: 'Documents Folder',
          expandedIcon: 'pi pi-folder-open',
          collapsedIcon: 'pi pi-folder',
          leaf: item?.HasChilden == 1 ? false : true,
          children: [],
        };
        if (this.RefreshAfterAdd) {
          this.nodeExpand({ node: ParentData }, true);
          // this.getTree()
        } else {
          this.finditemSelectedByIDAndAddChild(item?.ParentId, child);
        }
        this.ActionAfterAdd.emit();
      }
    });
  }
  AddPM(item: any) {
    const dialogRef = this.dialog
      .open(addPMTask, {
        width: '60vw',
        data: { AssetData: item },
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        // this.getDataPms();
      }
    });
  }
  finditemSelectedByIDAndAddChild(ID: any, child: any) {
    const searchTree = (element: any, ID: any) => {
      if (element.ID == ID) {
        element.children = [...element.children, child];
      } else if (element.children != null) {
        var i;
        var result: any = null;
        for (i = 0; result == null && i < element.children.length; i++) {
          result = searchTree(element.children[i], ID);
        }
        return result;
      }
      return null;
    };
    if (this.dataTree.length > 0) {
      this.dataTree.forEach((value: any) => {
        searchTree(value, ID);
      });
    }
  }
  nodeExpand(event: any, addForce: boolean = false) {
    if (event.node) {
      event.node.loading = true;
      this.blockedPanel = true;
      //in a real application, make a call to a remote url to load children of the current node and add the new nodes as children

      if (event.node.children && event.node.children.length > 0 && !addForce) {
        this.blockedPanel = false;
        event.node.loading = false;
        return;
      }
      event.node.expanded = true;
      this.assetsService
        .getAssetsTree(this.configApi, event.node.ID, event.node.LocationId)
        .pipe(
          map((value: any) => {
            return {
              data: value.Data.map((item: any) => {
                return {
                  ...item,
                  label: item.AssetName + ' (' + item.CategoryName + ') ',
                  key: item.AssetName,
                  data: 'Documents Folder',
                  expandedIcon: 'pi pi-folder-open',
                  collapsedIcon: 'pi pi-folder',
                  leaf: item.HasChilden == 1 ? false : true,
                };
              }),
            };
          })
        )
        .subscribe((nodes: any) => {
          event.node.children = nodes.data;
          event.node.loading = false;
          this.blockedPanel = false;

          this.cdr.detectChanges();
        });
    }
  }

  moveOnWorkOrderForAsset(ID: any) {
    let url =
      window.location.href.split('Asset')[0] +
      '/WorkOrder/workOrderNotCompleted?AssetId=' +
      ID;
    window.open(url, '_blank');
  }
  Filter() {}
  DuplicateTreeData: any;
  confirmDuplicateAsset(node: any) {
    this.confirmdeleteWorkOrder.openModal();
    this.DuplicateTreeData = node;
  }
  DuplicateAsset() {
    this.assetsService
      .DuplicateAssetInTree(this.DuplicateTreeData.ID)
      .subscribe((rv) => {});
  }
  // ngAfterContentChecked(): void {
  //   console.log(
  //     'ngAfterContentChecked'
  //     // this.el.nativeElement.querySelector('.p-tree')
  //   );
  //   const mh = this.el.nativeElement?.querySelector('.p-tree');
  //   const mh1 = mh?.querySelectorAll('.p-treenode');
  //   mh1?.forEach((value: any) => {
  //     const mh2 = value.querySelector('.TESTTest');
  //     const mh3 = value?.querySelector('.p-treenode-content');

  //     // console.log('mh2', mh2?.getAttribute('isAsset'));
  //     if (mh2?.getAttribute('isAsset') == 'false') {
  //       mh3.style.backgroundColor = 'rgb(102 169 237 / 23%)';
  //     } else {
  //       // mh3.style.backgroundColor = 'white';
  //     }
  //   });
  //   // console.log('mh1', mh1);
  // }
  // deleteAsset() {
  //   this.assetsService.deleteAsset(this.assetIdDeleted).subscribe(
  //     (res: any) => {
  //       if (res.rv > 0) {
  //         this.Assets$ = this.Assets$.pipe(
  //           map((value: any[], index) => {
  //             value.forEach((item: any, index: any) => {
  //               if (item.ID == this.assetIdDeleted) {
  //                 value.splice(index, 1);
  //               }
  //             });
  //             return value;
  //           })
  //         );
  //
  //         this.getAssets();
  //       } else {
  //         this.toster.error(res.Msg);
  //       }
  //     },
  //     (err) => {
  //       this.toster.error(err.Msg);
  //     }
  //   );
  // }
}
