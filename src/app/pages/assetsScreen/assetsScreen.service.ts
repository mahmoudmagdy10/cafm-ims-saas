import { map, shareReplay, retry, tap } from 'rxjs/operators';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { HttpService } from './../../modules/auth/services/http.service';

import { Injectable } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { ViewDataFilterService } from 'src/app/shared/components/view-data-filter/view-data-filter.service';

@Injectable({ providedIn: 'root' })
export class assetsScreenService {
  constructor(
    private http: HttpService,
    private viewDataFilterService: ViewDataFilterService
  ) {}
  dataFeilds$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  refresh$: BehaviorSubject<any> = new BehaviorSubject<any>('');
  feildsView$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  codesSub: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  UnSelectedItemSubject$ = new Subject<any>();
  dataTableAssets$: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  loadingAssets$: BehaviorSubject<any> = new BehaviorSubject<any>(false);

  dataForMapSub: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  dataForMap$ = this.dataForMapSub.asObservable();
  selectedPage: any = 1;
  RowCount: any = 50;

  //  Code
  getCodeAssets() {
    this.codesSub.next(false);
    const params = {
      LocationId: localStorage.getItem('defaultLocation'),
      ScreenName: 'Assests',
    };
    this.http
      .getData('/Code', params)
      .pipe(
        map((code: any) => {
          let Assets = code?.ParentId?.map((value: any) => {
            return {
              ...value,
              label:
                value.AssetName +
                ' (' +
                code.Categories.find(
                  (item: any) => item.code == value.CategoryId
                )?.name +
                ') ',
              key: value.ID,
              isAsset: value?.isAsset,
              styleClass: 'testtttt',
              data: value,
              expandedIcon: 'pi pi-folder-open',
              collapsedIcon: 'pi pi-folder',
            };
          });
          return {
            ...code,
            ParentId: {
              AllAssets: Assets,
              subLocationJust: Assets?.filter((value: any) => !value?.isAsset),
            },
          };
        }),
        retry(3)
      )
      .subscribe((value) => {
        this.codesSub.next(value);
      });
  }
  get codes$() {
    return this.codesSub.asObservable();
  }
  // CommonFeild
  addCommonFeild(body: any) {
    return this.http.saveData('/Components/CommonFields', {
      ...body,
      ComponentType: 'Assets',
    });
  }
  getFeild() {
    const body = {
      LocationId: localStorage.getItem('defaultLocation'),
      ComponentType: 'Assets',
    };
    return this.http.getData('/Components/CommonFields', body);
  }
  deleteCommonFeild(body: any) {
    return this.http.deleteDate('/Components/CommonFields', {
      ...body,
      ComponentType: 'Assets',
    });
  }
  getFeildById(id: any) {
    const body = {
      LocationId: localStorage.getItem('defaultLocation'),
      ID: id,
      ComponentType: 'Assets',
    };
    return this.http.getData('/Components/CommonFields', body);
  }

  //get and set data common feild
  get DataFeild$(): Observable<any> {
    return this.dataFeilds$.asObservable();
  }

  setDataFeild$(data: any) {
    this.dataFeilds$.next(data);
  }

  // Assets
  addAssets(body: any) {
    return this.http.saveData('/Assets', body);
  }
  getAssets() {
    this.loadingAssets$.next(true);
    this.http
      .getData('/Assets', {
        LocationId: localStorage.getItem('defaultLocation'),
        CurrentPage: this.selectedPage,
        ...this.viewDataFilterService.datafilterModel?.Asset?.dataFilter
          ?.params,
        RowCount: 50,
      })
      .subscribe((value) => {
        this.dataTableAssets$.next(value);
        this.loadingAssets$.next(false);
      });
  }
  get DataTableAssets$() {
    return this.dataTableAssets$.asObservable();
  }
  get LoadingAssets$() {
    return this.loadingAssets$.asObservable();
  }
  getAssetsTree(configApi: any, ID?: any, LocationId?: any, filter?: any) {
    const params = {
      LocationId: LocationId || localStorage.getItem('defaultLocation'),
      ParentId: ID ? ID : '',
      ...filter,
    };
    if (params?.ParentId) {
      return this.http.getData(configApi?.apiGetChildren, params).pipe(
        map((value: any) => {
          return {
            Data: value?.Data.map((item: any, index: any) => {
              return {
                ...item,
                label: item?.AssetName + ' (' + item.CategoryName + ') ',
                key: item?.AssetName + '_' + index,
                data: 'Documents Folder',
                expandedIcon: 'pi pi-folder-open',
                collapsedIcon: 'pi pi-folder',
                leaf: item?.HasChilden == 1 ? false : true,
                loading: false,
                expanded: !!filter?.AssetName,
                // ParentId: 0,
              };
            }),
            setting: value?.Setting[0],
          };
        }),

        tap((_) => {
          // this.assetsService.getAssetsForDisplayMap();
        })
      );
    } else {
      return this.http
        .getData(configApi?.apiGetTree, params)
        .pipe(
          tap((value) => {
            this.dataForMapSub.next([
              ...this.dataForMapSub.value,
              ...value?.Data,
            ]);
          })
        )
        .pipe(
          map((value: any) => {
            return {
              Data: value?.Data.map((item: any, index: any) => {
                return {
                  ...item,
                  label: item?.AssetName + ' (' + item.CategoryName + ') ',
                  key: item?.AssetName + '_' + index,
                  data: 'Documents Folder',
                  expandedIcon: 'pi pi-folder-open',
                  collapsedIcon: 'pi pi-folder',
                  leaf: !!filter?.AssetName
                    ? true
                    : item?.HasChilden == 1
                    ? false
                    : true,
                  loading: false,
                  expanded: !!filter?.AssetName,

                  // ParentId: 0,
                };
              }),

              setting: value?.Setting[0],
            };
          }),

          tap((_) => {
            // this.assetsService.getAssetsForDisplayMap();
          })
        );
    }
  }
  getAssetsById(ID: number | string, LocationId?: any) {
    const params = {
      LocationId: LocationId || localStorage.getItem('defaultLocation'),
      AssetId: ID,
    };
    return this.http.getData('/Assets', params).pipe(shareReplay(1));
  }
  //  Add image For Asset
  addImageForAsset(body: any) {
    return this.http.saveFormDate('/Assets/Image', body);
  }
  //add field in asset
  addFieldAsset(body: any) {
    return this.http.saveData('/Components/Fields', {
      ...body,
      ComponentType: 'Assets',
    });
  }

  //add field File in asset
  addFieldFileAsset(body: any) {
    return this.http.saveFormDate('/Components/S3FieldsFile', {
      ...body,
      ComponentType: 'Assets',
    });
  }

  // refresh data asset by Id
  refreahAssetsById() {
    this.refresh$.next('');
  }
  // Delete Assets
  deleteAsset(ID: any) {
    const Params = {
      ID: ID,
    };
    return this.http.deleteDate('/Assets', Params);
  }
  // Delete Field In Asset
  deleteFieldInAsset(Params: any) {
    return this.http.deleteDate('/Components/Fields', {
      ...Params,
      ComponentType: 'Assets',
    });
  }
  getFieldsHistroy(params: any) {
    return this.http
      .getData('/Components/FieldsHistroy', {
        ...params,
        ComponentType: 'Assets',
      })
      .pipe(shareReplay(1));
  }
  //  Fields Shown In Asset
  ChangeFieldShown(body: any) {
    return this.http.saveData('/Components/FieldsShown', {
      ...body,
      ComponentType: 'Assets',
    });
  }
  //save Capital Depreciation
  saveCapitalDepreciation(body: any) {
    return this.http.saveData('/Assets/CapitalDepreciation', body);
  }

  // Actions Selected
  SetUnSelectedItem(itemUnSelectd: any) {
    this.UnSelectedItemSubject$.next(itemUnSelectd);
  }
  deleteAssetsSelected(Params: any) {
    return this.http.deleteDate('/Assets', Params);
  }
  transferAssets(Params: any) {
    return this.http.saveData('/Assets/Transfer', Params);
  }
  //  Add Catigories In Asset
  AddCategories(Name: any) {
    return this.http.saveData('/Components/Categories', {
      categoryName: Name,
      ComponentType: 'Assets',
    });
  }
  //  Delete Catigories In Asset
  DeleteCategories(Params: any) {
    return this.http.deleteDate('/Components/Categories', Params);
  }
  // delete asset with Vendor
  deleteAssetWithVendor(body: any) {
    return this.http.deleteDate('/Vendors/Assets', body);
  }
  // Change Parent
  changeParent(body: any) {
    return this.http.saveData('/Assets/ChangeParent', body);
  }

  // link With Vendor
  linkWithVendor(body: any) {
    return this.http.saveData('/Vendors/Assets', body);
  }

  linkpartWithAsset(body: any[]) {
    return this.http.saveDataArray('/Store/AssetParts', body);
  }
  deleteSparePart(body: any) {
    return this.http.deleteDate('/Store/AssetParts', body);
  }

  getDataForExcel(params: any) {
    return this.http.getData('/Assets', {
      ...params,
      RowCount: 2002153,
      LocationId: localStorage.getItem('defaultLocation'),
    });
  }
  DataPmsForAssetSub = new BehaviorSubject(undefined);
  getAllPmsFprAsset(AssetId: any, LocationId?: any) {
    this.DataPmsForAssetSub.next(undefined);
    this.http
      .getData('/PreventiveMaintenance', {
        LocationId: LocationId || localStorage.getItem('defaultLocation'),
        AssetId: AssetId,
        isForAssets: true,
      })
      .pipe(map((value) => value?.Data))

      .subscribe((value) => {
        this.DataPmsForAssetSub.next(value);
      });
  }

  get DataPmsForAsset$() {
    return this.DataPmsForAssetSub.asObservable();
  }

  AssetsForDisplayMap = new BehaviorSubject(undefined);
  AssetsForDisplayMap$ = this.AssetsForDisplayMap.asObservable();
  getAssetsForDisplayMap() {
    // this.AssetsForDisplayMap.next(undefined);
    // this.http
    //   .getData('/Assets', {
    //     RowCount: 2002153,
    //     LocationId: localStorage.getItem('defaultLocation'),
    //   })
    //   .subscribe((value) => {
    //     this.AssetsForDisplayMap.next(value);
    //   });
  }
  DuplicateAsset(AssetId: number) {
    const params = {
      AssetId: AssetId,
    };
    return this.http.getData('/Assets/Duplicate', params).pipe();
  }
  // ProblemIdentification = new BehaviorSubject(undefined);
  // getProblemIdentification(ID: number | string, LocationId?: any) {
  //   const params = {
  //     LocationId: LocationId || localStorage.getItem('defaultLocation'),
  //     AssetId: ID,
  //   };
  //   return this.http
  //     .getData('/Assets/ProblemIdentification', params)
  //     .pipe(tap((val) => {}));
  // }
  ProblemIdentificationsub = new BehaviorSubject(undefined);
  ProblemIdentification$ = this.ProblemIdentificationsub.asObservable();
  getProblemIdentification(ID: number, filter?: any) {
    if (!filter) filter = {};
    this.ProblemIdentificationsub.next(undefined);
    return this.http
      .getData('/Assets/ProblemIdentification', {
        LocationId: localStorage.getItem('defaultLocation'),
        ...this.viewDataFilterService.datafilterModel?.ProblemIdentification
          ?.dataFilter?.params,
        RowCount: this.RowCount,
        ...filter,
        AssetId: ID,
      })
      .subscribe((value) => {
        this.ProblemIdentificationsub.next(value);
      });
  }

  CodesAssetTree() {
    return this.http
      .getData('/Assets/Tree', {
        LocationId: localStorage.getItem('defaultLocation'),
      })
      .subscribe((value) => {
        this.codesAssetTree.next(value);
      });
  }
  codesAssetTree = new BehaviorSubject(undefined);
  codesAssetTree$ = this.codesAssetTree.asObservable();

  DuplicateAssetInTree(AssetId: number) {
    const params = {
      id: AssetId,
      locationId: localStorage.getItem('defaultLocation'),
    };
    return this.http.saveData('/Assets/DuplicateParentTree', params).pipe();
  }
}
