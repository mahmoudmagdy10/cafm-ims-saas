import { FieldManagmentService } from 'src/app/shared/components/FieldManagment/FieldManagment.service';
import { ViewItemInFieldService } from 'src/app/shared/components/ViewFieldInItem/view-field-in-item.service';
import { depreciationComponent } from './../cardAssetTabs/depreciation/depreciation.component';
import { settingAssetsComponent } from './../cardAssetTabs/settingAssets/settingAssets.component';
import { assetsScreenService } from '../../assetsScreen.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { finalize, map, tap } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { LogsByComponentTypeService } from 'src/app/shared/components/logs-by-component-type/logs-by-component-type.service';

@Component({
  selector: 'card-assets-link',
  templateUrl: 'cardAssetLink.component.html',
})
export class cardAssetLinkComponent implements OnInit {
  constructor(
    private assetsService: assetsScreenService,
    private toastr: ToastrService,
    private _activatedRoute: ActivatedRoute,
    private addFieldService: ViewItemInFieldService,
    public fieldManagmentService: FieldManagmentService,
    private _logsByComponentTypeService: LogsByComponentTypeService
  ) {}
  data: any;
  AssetsById$: Observable<any>;
  Loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  AssetsById: any;
  indexTab: any;
  NameAssets: any;
  ngOnInit(): void {
    this.addFieldService.ComponentType = 'Assets';
    this.fieldManagmentService.ComponentType = 'Assets';
    const id = this._activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.assetsService.getAllPmsFprAsset(id);
      this.getFeild();
      this.assetsService.getCodeAssets();
      this.assetsService.codes$.subscribe((value) => {
        this.data = {
          ID: id,
          code: value,
        };
        this._logsByComponentTypeService?.startUse('Assets', this.data.ID);

        this.getAssetsById();
      });
    }
  }
  getFeild() {
    this.assetsService.getFeild().subscribe((value) => {
      this.assetsService.setDataFeild$(value);
    });
  }
  getAssetsById() {
    this.Loading.next(true);
    this.AssetsById$ = this.assetsService.getAssetsById(this.data.ID).pipe(
      map((value) => {
        return {
          ...value.Data[0],
        };
      }),
      tap((value) => {
        this.AssetsById = value;
      }),
      finalize(() => {
        this.Loading.next(false);
      })
    );
    this.AssetsById$.subscribe((value: any) => {
      this.NameAssets = value.AssetName;
    });
  }
  EditInAssets(data: any) {
    this.assetsService.addAssets(data).subscribe(
      (res: any) => {
        if (res.rv > 0) {

        } else {

        }
      },
      (err) => {

      }
    );
  }

  get loading$() {
    return this.Loading.asObservable();
  }
}
