import { HttpService } from 'src/app/modules/auth/services/http.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ViewDataFilterService } from 'src/app/shared/components/view-data-filter/view-data-filter.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class TemplatesForSopService {
  Codes$: BehaviorSubject<any> = new BehaviorSubject<any>('a');
  DataPms$: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  dataInStructionEdit$: BehaviorSubject<any> = new BehaviorSubject<any>(false);

  AllSchedulesTimeSub: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  SchedulesTimeByPMSIDSub: BehaviorSubject<any> = new BehaviorSubject<any>(
    false
  );
  PMSIdOpened: any;
  RowCountList: any = 50;
  constructor(
    private http: HttpService,
    private viewDataFilterService: ViewDataFilterService,
    private router: Router
  ) {}
  //  Code
  getCodePms() {
    const params = {
      LocationId: localStorage.getItem('defaultLocation'),
      ScreenName: 'WorkOrderTemplate',
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
        RowCount: this.RowCountList,
        CurrentPage: this.selectedPage,
        isTemplate: true,
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
      isTemplate: true,
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
    });
  }

  // add instruction
  addInStruction(body: any) {
    return this.http.saveData('/WorkOrder/SOP', {
      ...body,
      pmId: this.PMSIdOpened,
    });
  }

  // get instruction
  getInStruction() {
    this.dataInStructionEdit$.next(false);

    return this.http
      .getData('/WorkOrder/SOP', {
        pmId: this.PMSIdOpened,
        LocationId: localStorage.getItem('defaultLocation'),
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
    return this.http.deleteDate('/WorkOrder/SOP', { Ids: ID });
  }

  // add New Value To Inst
  addNewValueToInst(body: any) {
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
    });
  }
  // reset Instruction from Tasks
  resetInstructionFromTasks(ids: any) {
    return this.http.saveData('/WorkOrder/SOPRest', { ids: ids });
  }
  // delete  Schedules
  deleteSchedules(ID: any) {
    return this.http.deleteDate('/PreventiveMaintenance/Schedules', {
      ID: ID,
    });
  }
  // delete  SchedulesTime
  deleteSchedulesTime(ID: any) {
    return this.http.deleteDate('/PreventiveMaintenance/Schedules', {
      ID: ID,
    });
  }
  // create WorkOrder
  createWorkOrder(body: any) {
    return this.http.saveData('/PreventiveMaintenance/WorkOrder', body);
  }
  getAllSchedulesTime() {
    this.AllSchedulesTimeSub.next(false);
    this.http
      .getData('/PreventiveMaintenance/SchedulesTime', {
        LocationId: localStorage.getItem('defaultLocation'),
        isSoftService: this.IsSoftService()
      })
      .subscribe((value) => {
        this.AllSchedulesTimeSub.next(value);
      });
  }
  get AllSchedulesTime$() {
    return this.AllSchedulesTimeSub.asObservable();
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
    return this.http.getData('/PreventiveMaintenance', {
      ...this.viewDataFilterService.datafilterModel?.PPM?.dataFilter,
      RowCount: 2002153,
      LocationId: localStorage.getItem('defaultLocation'),
    });
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

  IsSoftService() {
    const currentRoute = this.router.url;
    const segmentsToCheck = ['CreateSoftServices', 'SoftServiceTasks', 'CompletedSST'];
    return segmentsToCheck.some(segment => currentRoute.includes(segment));
  }
}
