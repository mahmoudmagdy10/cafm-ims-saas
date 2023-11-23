import { HttpService } from 'src/app/modules/auth/services/http.service';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ViewDataFilterService } from 'src/app/shared/components/view-data-filter/view-data-filter.service';
import { BehaviorSubject, Subject, Observable, forkJoin, of } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PmsService {
  FromDate: any;
  ToDate: any;
  Codes$: BehaviorSubject<any> = new BehaviorSubject<any>('');
  DataPms$: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  dataInStructionEdit$: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  PPMSelected: any[] = [];
  RowCountPM: any = 50;
  RowCountAccordingUser: any = 50;
  AllSchedulesTimeSub: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  SchedulesTimeByPMSIDSub: BehaviorSubject<any> = new BehaviorSubject<any>(
    false
  );
  PMSIdOpened: any;
  AllSchedulesTimeCalenderSub: BehaviorSubject<any> = new BehaviorSubject<any>(
    undefined
  );
  selectedCalenderPage = 1;
  RowCountCalender: any = 1000;
  resetSelected: Subject<any> = new Subject<any>();
  resetSelectedpage$: Observable<any> = this.resetSelected.asObservable();
  constructor(
    private http: HttpService,
    private viewDataFilterService: ViewDataFilterService,
    private router: Router
  ) {}
  //  Code
  getCodePms() {
    const params = {
      LocationId: localStorage.getItem('defaultLocation'),
      ScreenName: 'PreventiveMaintenance',
      isSoftService : this.IsSoftService()
    };
    this.http
      .getData('/Code', params)
      .pipe(
        map((code: any) => {
          return {
            ...code,
            AssetId: code?.AssetId?.map((value: any) => {
              return {
                ...value,
                label: value.AssetName + ' (' + value.CategoryName + ') ',
                key: value.AssetName,
                data: 'Documents Folder',
                expandedIcon: 'pi pi-folder-open',
                collapsedIcon: 'pi pi-folder',
              };
            }),
          };
        })
      )
      .subscribe((value) => {
        this.Codes$.next(value);
      });
  }
  get CodeObz$() {
    return this.Codes$.asObservable();
  }
  selectedPage = 1;
  // get All Pms
  getAllPms() {
    this.DataPms$.next(false);
    this.http
      .getData('/PreventiveMaintenance', {
        LocationId: localStorage.getItem('defaultLocation'),
        ...this.viewDataFilterService.datafilterModel?.PPM?.dataFilter?.params,
        RowCount: this.RowCountPM,
        CurrentPage: this.selectedPage,
        isTemplate: false,
        isSoftService: this.IsSoftService()
      })

      .subscribe((value) => {
        this.DataPms$.next(value);
      });
  }
  get AllPmsObz$() {
    return this.DataPms$.asObservable();
  }
  // add new Pms
  addNewPms(body: any) {
    return this.http.saveData('/PreventiveMaintenance', {
      LocationId: localStorage.getItem('defaultLocation'),
      ...body,
      isTemplate: false,
      isSoftService : this.IsSoftService()
    });
  }
  // delete  Pms
  deletePMS(ID: any) {
    return this.http.deleteDate('/PreventiveMaintenance', {
      ID: ID,
    });
  }

  // add new Pms
  getPmsAsId(ID: any) {
    return this.http
      .getData('/PreventiveMaintenance', {
        LocationId: localStorage.getItem('defaultLocation'),
        ID: ID,
        isSoftService: this.IsSoftService()
      })
      .pipe(
        map((value: any) => {
          return value?.Data;
        })
      );
  }
  // create Or Edit Schedules
  createOrEditSchedules(body: any) {
    return this.http.saveData('/PreventiveMaintenance/Schedules', {
      ...body,
      isSoftService: this.IsSoftService()
    });
  }

  // add instruction
  addInStruction(body: any) {
    return this.http.saveData('/WorkOrder/SOP', {
      ...body,
      pmId: this.PMSIdOpened,
      isSoftService: this.IsSoftService()
    });
  }

  // get instruction
  getInStruction() {
    this.dataInStructionEdit$.next(false);

    return this.http
      .getData('/WorkOrder/SOP', {
        pmId: this.PMSIdOpened,
        LocationId: localStorage.getItem('defaultLocation'),
        isSoftService: this.IsSoftService()
      })
      .pipe(
        map((value) => {
          return value.map((item: any) => {
            return {
              label: item.Name,
              data: item,
              ID: item.ID,
              expanded: true,
              ParentId: item.ParentId,
            };
          });
        })
      )
      .subscribe((value) => {
        this.dataInStructionEdit$.next(value);
      });
  }
  get dataInStructionEditObz$() {
    return this.dataInStructionEdit$.asObservable();
  }

  // Attach a file
  AttachAfileORImage(body: any) {
    return this.http.saveFormDate('/WorkOrder/S3SOPFile', body);
  }

  deleteIns(ID: number) {
    return this.http.deleteDate('/WorkOrder/SOP', { 
      Ids: ID,
      isSoftService: this.IsSoftService()
     });
  }

  // add New Value To Inst
  addNewValueToInst(body: any) {
    body.isSoftService = this.IsSoftService();
    return this.http.saveData('/WorkOrder/SOPFieldsValues', body);
  }

  mapTree(list: any[], level = 0) {
    const checkChildren = (
      tree: any[],
      option: any[],
      item: any,
      level: number
    ) => {
      tree.forEach((treeNode) => {
        if (treeNode.ID == item.ParentId) {
          treeNode.children.push({
            ...item,
            children: [],
            ParentId: treeNode.ID,
            level,
            option: [],
          });
        } else if (treeNode.children && treeNode.children.length > 0) {
          checkChildren(treeNode.children, [], item, level + 1);
        }
      });

      option.forEach((treeNode) => {
        if (treeNode.ID == item.ParentId) {
          treeNode.option.push({
            ...item,
            children: [],
            ParentId: treeNode.ID,
            level,
            option: [],
          });
        } else if (treeNode.children && treeNode.children.length > 0) {
          checkChildren([], treeNode.option, item, level + 1);
        }
      });
    };

    let tree: any[] = [];

    list.forEach((item) => {
      if (!item.ParentId) {
        tree.push({ ...item, children: [], option: [], ParentId: 0, level });
      }
    });
    if (tree.length > 0) {
      list.forEach((item) => {
        if (item.ParentId) {
          checkChildren(tree, tree, item, level + 1);
        }
      });
    }

    return tree;
  }
  // get Field As asset ID
  getFieldAsAssetID(idAsset: any, fieldType: any) {
    return this.http.getData('/Components/Fields', {
      ComponentType: 'Assets',
      ComponentId: idAsset,
      fieldType: fieldType,
      isSoftService: this.IsSoftService()
    });
  }
  // reset Instruction from Tasks
  resetInstructionFromTasks(ids: any) {
    return this.http.saveData('/WorkOrder/SOPRest', { 
      ids: ids,
      isSoftService: this.IsSoftService()
    });
  }
  // delete  Schedules
  deleteSchedules(ID: any) {
    return this.http.deleteDate('/PreventiveMaintenance/Schedules', {
      ID: ID,
      isSoftService: this.IsSoftService()
    });
  }
  // delete  SchedulesTime
  deleteSchedulesTime(ID: any) {
    return this.http.deleteDate('/PreventiveMaintenance/SchedulesTime', {
      ID: ID,
      isSoftService: this.IsSoftService()
    });
  }
  // switch  SchedulesTime
  PMScheduleTimesToWorkOrder(PMScheduleTimesID: any) {
    return this.http.saveDataInParam(
      '/PreventiveMaintenance/PMScheduleTimesToWorkOrder',
      {
        PMScheduleTimesID: PMScheduleTimesID,
        LocationId: localStorage.getItem('defaultLocation'),
        isSoftService: this.IsSoftService()
      }
    );
  }
  selectedPageDaliy: any = 1;
  // create WorkOrder
  createWorkOrder(body: any) {
    body.isSoftService = this.IsSoftService()
    return this.http.saveData('/PreventiveMaintenance/WorkOrder', body);
  }
  getAllSchedulesTime() {
    this.AllSchedulesTimeSub.next(false);
    this.http
      .getData('/PreventiveMaintenance/AllTimeSchedules', {
        LocationId: localStorage.getItem('defaultLocation'),
        RowCount: this.RowCountAccordingUser,
        CurrentPage: this.selectedPageDaliy,
        ...this.viewDataFilterService.datafilterModel?.PPM?.dataFilter?.params,
        isSoftService: this.IsSoftService()
      })
      .subscribe((value) => {
        this.AllSchedulesTimeSub.next(value);
      });
  }
  get AllSchedulesTime$() {
    return this.AllSchedulesTimeSub.asObservable();
  }

  getAllSchedulesTimeCalender(filter: any) {
    this.AllSchedulesTimeCalenderSub.next(false);
    this.http
      .getData('/PreventiveMaintenance/AllTimeSchedules', {
        LocationId: localStorage.getItem('defaultLocation'),
        ...filter,
        ...this.viewDataFilterService.datafilterModel?.PPM?.dataFilter?.params,
        CurrentPage: this.selectedCalenderPage,
        RowCount: this.RowCountCalender,
        isSoftService: this.IsSoftService()
      })
      .subscribe((value) => {
        this.AllSchedulesTimeCalenderSub.next(value);
      });
  }
  get AllSchedulesTimeCalender$() {
    return this.AllSchedulesTimeCalenderSub.asObservable();
  }
  getSchedulesTimeByPMSID(PMId: any) {
    this.SchedulesTimeByPMSIDSub.next(false);
    this.http
      .getData('/PreventiveMaintenance/SchedulesTime', {
        PMId: PMId,
        LocationId: localStorage.getItem('defaultLocation'),
        isSoftService: this.IsSoftService()
      })
      .subscribe((value) => {
        this.SchedulesTimeByPMSIDSub.next(value);
      });
  }
  get SchedulesTimeByPMSID$() {
    return this.SchedulesTimeByPMSIDSub.asObservable();
  }

  getDataForExcel() {
    return this.http
      .getData('/PreventiveMaintenance', {
        ...this.viewDataFilterService.datafilterModel?.PPM?.dataFilter,
        RowCount: 2002153,
        LocationId: localStorage.getItem('defaultLocation'),
      })
      .pipe(map((value) => value?.Data));
  }
  linkpartWithPreventive(body: any[]) {
    const arr = body.map((value) => {
      return {
        ...value,
        preventiveMaintenanceId: this.PMSIdOpened,
      };
    });
    return this.http.saveDataArray('/PreventiveMaintenance/Parts', arr);
  }
  deleteSparePart(ID: number) {
    return this.http.deleteDate('/PreventiveMaintenance/Parts', {
      PartId: ID,
      PMId: this.PMSIdOpened,
    });
  }
  CalenderUpateDate(body: any) {
    return this.http.saveData('/PreventiveMaintenance/CalenderUpateDate', body);
  }
  PMReportPrint(body: any) {
    return this.http.getBlob('/AllReports/PMReportPrint', {
      ...body,
      isSoftService: this.IsSoftService(),
      LocationId: localStorage.getItem('defaultLocation'),
    });
  }

  printSelected() {
    return this.http.getBlob('/AllReports/PMReportPrint', {
      IDs: this.PPMSelected.join(','),
      LocationId: localStorage.getItem('defaultLocation'),
      isSoftService: this.IsSoftService()
    });
  }
  deleteFileInSop(body: any) {
    return this.http.deleteDate('/WorkOrder/WorkOrderSOPFiles', body);
  }
  printWeekly(body: any) {
    return this.http.getBlob('/AllReports/PMReportPrint', {
      ...body,
      LocationId: localStorage.getItem('defaultLocation'),
      isSoftService: this.IsSoftService()
    });
  }
  PMDuplicateForListAssets(body: any) {
    return this.http
      .saveDataInParam('/PreventiveMaintenance/PMDuplicateForListAssets', {
        ...body,
        LocationId: localStorage.getItem('defaultLocation'),
        PMID: this.PMSIdOpened,
        isSoftService: this.IsSoftService()
      })
      .subscribe((val) => {});
  }
  RunCurrentPPM(body: any) {
    return this.http
      .saveData('/CoreJobs/RunCurrentPPM', {
        ...body,
        LocationId: localStorage.getItem('defaultLocation'),
      })
      .subscribe((val) => {});
  }
  DateAndTime = new BehaviorSubject<any>(undefined);
  DateAndTime$ = this.DateAndTime.asObservable();
  getDate() {
    this.http
      .getData('/Code/CurrentDateTime', {
        LocationId: localStorage.getItem('defaultLocation'),
      })
      .subscribe((val) => {
        this.DateAndTime.next(val.CurrentDate);
      });
  }
  BalancedRedistribution(body: any) {
    return this.http.saveData('/PreventiveMaintenance/BalanceDistribution', {
      ...body,
      LocationId: localStorage.getItem('defaultLocation'),
    });
  }

  IsSoftService() {
    const currentRoute = this.router.url;
    const segmentsToCheck = ['CreateSoftServices', 'SoftServiceTasks', 'CompletedSST'];
    return segmentsToCheck.some(segment => currentRoute.includes(segment));
  }

}
