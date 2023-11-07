import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { FilterModuleComponent } from './FilterModule/FilterModule.component';
import { administratorService } from './administrator.service';
import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  ElementRef,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { addModuleComponent } from './addModule/addModule.component';
import { modal4Component } from './changePass/modal4.component';
import { tap, map } from 'rxjs/operators';
import { ExportTOExcelShared } from 'src/app/shared/ExportTableToExcel';
import { TemplateForBackup } from './TemplateForBackup/TemplateForBackup.component';
import { TemplateForBackupForCompany } from './TemplateForBackupForCompany/TemplateForBackupForCompany.component';
import { AuthService } from 'src/app/modules/auth';

@Component({
  selector: 'app-administrator',
  templateUrl: './administrator.component.html',
  styleUrls: ['./administrator.component.scss'],
})
export class administratorComponent implements OnInit, OnDestroy {
  displayViewSub: boolean = false;
  displayViewEditSub: boolean = false;
  DataView: any[];
  DataViewCompany: any[];
  SubscriptionByComID: any[];
  loadinggetSubscriptionByComID: boolean = false;
  SubscriptionByID: any[];
  loadinggetSubscriptionByID: boolean = false;
  displayAddNewSub: boolean = false;
  idComSelected: any;
  dataFilter: any;
  displayViewfilter: boolean = false;
  displayViewActivtion: boolean = false;
  displayViewSendEmail: boolean = false;
  indexCam: any;
  itemCamSendEmail: any;
  listPagination: any[] = [];
  selectedPage = 1;
  FiltersSearch: any = {
    CompanyName: '',
    SubscriptionStatusId: '',
    SubscriptionTypeId: '',
    StartDate: '',
    EndDate: '',
    ServicesID: '',
    CurrentPage: 1,
    SubscriptionStatusName: '',
    SubscriptionTypeName: '',
    ServicesName: '',
  };
  showLabelsFilter: boolean = false;
  itemActivision: any;
  loadingDataCom: boolean = false;
  @ViewChild('FilterModuleComponent', { static: true })
  filterModuleComponent: FilterModuleComponent;
  interval: any;
  subscription: Subscription;
  Codes: any;
  CompanyIdDeleted: any;
  dir: any;
  constructor(
    public Adddailog: MatDialog,
    private auth: AuthService,
    public administratorService: administratorService,
    private cdr: ChangeDetectorRef,
    private _router: Router,
    private toster: ToastrService
  ) {}
  ngOnInit() {
    this.dir = document.dir;
    this.administratorService.getCodeCampony().subscribe((Value) => {
      console.log('ValueXXX', Value);
      this.Codes = Value;
    });
    this.subscription = this.auth.getonTimer().subscribe((value: any) => {
      if (this.interval) {
        clearInterval(this.interval);
      }

      let TimerRefresh = localStorage.getItem('TimerRefresh');

      if (TimerRefresh != '0' && TimerRefresh != 'now' && TimerRefresh) {
        this.interval = setInterval(() => {
          this.getDataCom();
        }, +TimerRefresh);
      } else if (value == 'now') {
        this.getDataCom();
      }
    });

    this.getDataCom();
  }
  getDataCom() {
    this.loadingDataCom = true;
    this.administratorService
      .getCamponyByFilter(this.FiltersSearch)
      .subscribe((Data) => {
        this.DataView = Data.Data.map((value: any, index: any) => {
          return {
            ...value,
            index:
              index +
              (this.FiltersSearch.CurrentPage - 1) * Data.Setting[0].RowCount,
          };
        });
        this.listPagination = [];

        for (var i = 1; i <= Data.Setting[0].TotalPage; i++) {
          this.listPagination.push(i);
        }

        this.loadingDataCom = false;
        this.cdr.detectChanges();
      });
  }
  opendialog() {
    let dialogRef = this.Adddailog.open(addModuleComponent, {
      data: { Codes: this.Codes },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((addNew) => {
      if (addNew) {
        this.getDataCom();
      }
    });
  }
  selectPage(PageCount: any) {
    if (PageCount == 'next') {
      this.selectedPage = this.selectedPage + 1;
    } else if (PageCount == 'back') {
      this.selectedPage = this.selectedPage - 1;
    } else {
      this.selectedPage = PageCount;
    }
    this.FiltersSearch.CurrentPage = this.selectedPage;
    this.getDataCom();
  }
  openFilter() {
    this.displayViewfilter = true;
  }

  openSendEmail(itemCamSendEmail?: any) {
    this.displayViewSendEmail = true;
    if (itemCamSendEmail) {
      this.itemCamSendEmail = itemCamSendEmail;
    } else {
      this.itemCamSendEmail = 0;
    }
  }
  EditCampony(id: any, index: any) {
    this.indexCam = index;
    let dialogRef = this.Adddailog.open(addModuleComponent, {
      data: { Codes: this.Codes, IDCom: id },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((newData) => {
      this.DataView[index] = { ...this.DataView[index], ...newData };
      this.cdr.detectChanges();
    });
  }

  showDialogSubscription(idCom: any) {
    this.idComSelected = idCom;
    this.loadinggetSubscriptionByComID = true;
    this.getSubscriptionByComID();
    this.displayViewSub = true;
  }
  getSubscriptionByComID() {
    this.administratorService
      .getSubscriptionByComID(this.idComSelected)
      .subscribe((data: any) => {
        this.SubscriptionByComID = data;
        this.loadinggetSubscriptionByComID = false;
        this.cdr.detectChanges();
      });
  }
  getSubscriptionByID(idSup: any) {
    this.displayViewEditSub = true;
    this.loadinggetSubscriptionByID = true;
    this.administratorService
      .getSubscriptionByID(idSup, this.idComSelected)
      .subscribe((data: any) => {
        this.SubscriptionByID = data;
        this.loadinggetSubscriptionByID = false;
        this.cdr.detectChanges();
      });
  }
  AddNewSup() {
    this.SubscriptionByID = [];
    this.displayAddNewSub = true;
  }
  ActivisionModule(item: any, index: any) {
    this.indexCam = index;
    this.itemActivision = item;
    this.displayViewActivtion = true;
  }
  afterEditSub() {
    this.displayViewEditSub = false;

    this.getSubscriptionByComID();
  }
  afterSaveSub() {
    this.displayAddNewSub = false;
    this.getSubscriptionByComID();
  }
  change(event: any) {}
  afterSearch(Filters: any) {
    this.administratorService.filter = { ...Filters };

    this.displayViewfilter = false;
    this.FiltersSearch = {
      ...this.FiltersSearch,
      ...Filters,
    };

    this.getDataCom();
    this.selectPage(1);
    if (
      Filters.CompanyName == '' &&
      Filters.EndDate == '' &&
      Filters.ServicesID == '' &&
      Filters.ServicesName == '' &&
      Filters.StartDate == '' &&
      Filters.SubscriptionStatusId == '' &&
      Filters.SubscriptionTypeId == '' &&
      Filters.SubscriptionTypeName == '' &&
      Filters.SubscriptionStatusName == ''
    ) {
      this.showLabelsFilter = false;
    } else {
      this.showLabelsFilter = true;
    }
  }
  changeStatus(event: any) {
    if (event == false) {
      this.DataView[this.indexCam].CompanyStatusId = 35;
    } else {
      this.DataView[this.indexCam].CompanyStatusId = 22;
    }
    this.cdr.detectChanges();
    this.getDataCom();
  }
  clearFilter() {
    this.filterModuleComponent.clearFilter();
    this.filterModuleComponent.onSearch();
    this.showLabelsFilter = false;
  }
  ViewSubScription(id: any, name: string) {
    localStorage.setItem('CompanyForSub', name);
    this._router.navigate(['/settings/Subscription', id]);
  }
  onDelete() {
    this.administratorService
      .deleteCompanies(this.CompanyIdDeleted)
      .subscribe((res: any) => {
        if (res.rv > 0) {
          this.getDataCom();
        } else {
          this.toster.error(res.Msg);
        }
      });
  }
  changePass(userID: any) {
    let dialogRef = this.Adddailog.open(modal4Component, {
      width: '30%',
      data: { userId: userID },
      disableClose: true,
    });
  }
  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
  TemplateForBackup() {
    let dialogRef = this.Adddailog.open(TemplateForBackup, {
      width: '60%',

      disableClose: true,
    });
  }
  TemplateForBackupForCompany(ID: any) {
    let dialogRef = this.Adddailog.open(TemplateForBackupForCompany, {
      width: '35%',
      data: { ID: ID },
      disableClose: true,
    });
  }
  @ViewChild('TABLE') table: ElementRef;
  Excel$: Observable<any>;
  export() {
    this.Excel$ = this.administratorService.getDataForExcel().pipe(
      tap((value) => {
        setTimeout(() => {
          ExportTOExcelShared(this.table.nativeElement);
        }, 300);
      })
    );
  }
  openUsersLogs(item: any) {
    localStorage.setItem('DataUsersLogs', JSON.stringify(item));
    this._router.navigate(['/Admin/administrator', item.CompanyId]);
  }
}
