import { depreciationComponent } from '../cardAssetTabs/depreciation/depreciation.component';
import { settingAssetsComponent } from '../cardAssetTabs/settingAssets/settingAssets.component';
import { assetsScreenService } from '../../assetsScreen.service';
import { ToastrService } from 'ngx-toastr';
import { finalize, map, tap } from 'rxjs/operators';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  OnDestroy,
  ElementRef,
} from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { LogsByComponentTypeService } from 'src/app/shared/components/logs-by-component-type/logs-by-component-type.service';
import { treeService } from 'src/app/shared/components/Tree/tree.service';
import { FieldManagmentService } from 'src/app/shared/components/FieldManagment/FieldManagment.service';

@Component({
  selector: 'card-assets-modal',
  templateUrl: 'cardAssetModal.component.html',
})
export class cardAssetsModalComponent implements OnInit {
  constructor(
    private assetsService: assetsScreenService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<cardAssetsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _logsByComponentTypeService: LogsByComponentTypeService,
    private _treeService: treeService,
    private _FieldManagmentService: FieldManagmentService,
  ) {}
  AssetsById: any;
  AssetsById$: Observable<any> = of(false);
  NameAssets: any;
  Codes$: Observable<any>;

  indexTab: number;
  ngOnInit(): void {
    this.Codes$ = this.assetsService.codes$;
    this._FieldManagmentService.ComponentType = 'Assets';
    this.assetsService.getAllPmsFprAsset(this.data.ID, this.data?.LocationId);
    this.getAssetsById();
  }
  getAssetsById() {
    this.AssetsById$ = this.assetsService
      .getAssetsById(this.data.ID, this.data?.LocationId)
      .pipe(
        map((value) => {
          return {
            ...value.Data[0],
          };
        }),
        tap((value) => {
          this.AssetsById = value;
        })
      );

    this.AssetsById$.subscribe((value) => {
      this.NameAssets = value.AssetName;
      this._logsByComponentTypeService?.startUse('Assets', this.data.ID);
    });
  }
  EditInAssets(data: any) {
    this.assetsService.addAssets(data).subscribe(
      (res: any) => {
        if (res.rv > 0) {
        } else {
        }
      },
      (err) => {}
    );
  }
  @ViewChild('Report') Report!: ElementRef<HTMLImageElement>;

  exportPDF() {
    html2canvas(this.Report.nativeElement).then((canvas) => {
      const imgData = canvas.toDataURL('image/jpeg');

      const pdf = new jsPDF({
        orientation: 'portrait',
      });

      const imageProps = pdf.getImageProperties(imgData);

      const pdfw = pdf.internal.pageSize.getWidth();

      const pdfh = (imageProps.height * pdfw) / imageProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfw, pdfh);

      pdf.save('output.pdf');
    });
  }
  Close() {
    this.dialogRef.close();
  }
}
