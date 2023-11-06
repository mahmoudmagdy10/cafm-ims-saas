import { ToastrService } from 'ngx-toastr';
import { treeService } from 'src/app/shared/components/Tree/tree.service';
import { map, switchMap, tap } from 'rxjs/operators';
import { HttpService } from '../../modules/auth/services/http.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Observable, forkJoin, of } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class workOrderService {
  constructor(private http: HttpService) {}
  CardOpened: any;
  workOrderCompleted: boolean;
  WorkOrderOpened: any;
  CodesSub$: BehaviorSubject<any> = new BehaviorSubject<any>('');
  DataTasks$: BehaviorSubject<any> = new BehaviorSubject<any>('');
  Loading$: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  ActionUnSelected$: BehaviorSubject<any> = new BehaviorSubject<any>(0);
  WorkOrderSelected: any[] = [];
  dataInStructionEdit$: BehaviorSubject<any> = new BehaviorSubject<any>('');
  dataInStructionView$: BehaviorSubject<any> = new BehaviorSubject<any>('');
  filterSub: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  filter$: Observable<any> = this.filterSub.asObservable();
  isCalenderOpenSub: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  isCalenderOpen$ = this.isCalenderOpenSub.asObservable();
  DataTasksGroupSub: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  DataTasksGroup$ = this.DataTasksGroupSub.asObservable();

  LocationForUser: any;
  changeStatusCard: Subject<any> = new Subject<any>();
  changeStatusCard$: Observable<any> = this.changeStatusCard.asObservable();
  TotalSub: BehaviorSubject<any> = new BehaviorSubject<any>(0);
  Total$ = this.TotalSub.asObservable();
  selectedListPage = 1;
  selectedUserPage = 1;
  resetSelected: Subject<any> = new Subject<any>();
  resetSelectedpage$: Observable<any> = this.resetSelected.asObservable();
  selectedCalenderPageWork = 1;
  RowCount: any = 50;
  RowCountUser: any = 50;
  RowCountCalender: any = 100;

  FromDueDateForCalender: any = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  );
  ToDueDateForCalender: any = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0
  );

  //  Code
  getCodePreventiveTasks() {
    const params = {
      LocationId: localStorage.getItem('defaultLocation'),
      ScreenName: this.workOrderCompleted ? 'workOrderCompleted' : 'WorkOrders',
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
                label:
                  value.AssetName +
                  ' (' +
                  code.Categories.find(
                    (item: any) => item.code == value.CategoryId
                  )?.name +
                  ') ',
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
        this.CodesSub$.next(value);
      });
  }
  get Codes$() {
    return this.CodesSub$.asObservable();
  }
  // Add New Task
  addNewTask(body: any) {
    return this.http.saveData('/WorkOrder', {
      LocationId: localStorage.getItem('defaultLocation'),
      ...body,
    });
  }
  paramsFilter: any;
  // get All Tasks
  getAllTask(params: any) {
    this.paramsFilter = params;
    this.Loading$.next(true);
    this.http
      .getData('/WorkOrder/list', {
        LocationId: localStorage.getItem('defaultLocation'),
        ...params,
        CurrentPage: this.selectedListPage,
        RowCount: this.RowCount,
        isPM: false,
      })
      .pipe(
        map((value) => {
          return {
            ...value,
            Data: value?.Data.map((value: any) => {
              return {
                ...value,
                checked: false,
              };
            }),
          };
        })
      )
      .subscribe((value) => {
        this.Loading$.next(false);

        this.DataTasks$.next({
          ...value,
          statistics: value?.statistics
            ? value?.statistics
            : this.DataTasks$?.value?.statistics,
        });

        this.TotalSub.next(value?.Data?.length);
        if (!this.workOrderCompleted) {
          this.http
            .getData('/WorkOrder/ListUser', {
              LocationId: localStorage.getItem('defaultLocation'),
              ...params,
              CurrentPage: this.selectedUserPage,
              RowCount: this.RowCountUser,
            })
            .subscribe((value) => {
              this.DataTasksGroupSub.next(value);
            });
          this.getDataCalender();
        }
      });
  }
  CalenderListSub = new BehaviorSubject<any>(undefined);
  CalenderList$ = this.CalenderListSub.asObservable();
  getDataCalender() {
    this.http
      .getData('/WorkOrder/CalenderList', {
        LocationId: localStorage.getItem('defaultLocation'),
        ...this.paramsFilter,
        CurrentPage: this.selectedCalenderPageWork,
        FromDueDate: this.FromDueDateForCalender,
        ToDueDate: this.ToDueDateForCalender,
        RowCount: this.RowCountCalender,
      })
      .pipe(
        map((value) => {
          return {
            Data: value?.Data?.map((item: any) => {
              return {
                ...item,
                DueDate: item?.ScheduleDate,
                //         isShedule: true,
              };
            }),
            Setting: value?.Setting,
          };
        })
      )
      // .pipe(
      //   map((value) => {
      //     return value?.Data?.map((item: any) => {
      //       return {
      //         ...item,
      //         DueDate: item?.ScheduleDate,
      //         isShedule: true,
      //       };
      //     });
      //   })
      // )

      .subscribe((value) => {
        this.CalenderListSub.next(value);
      });
  }

  get AllTaskObz$() {
    return this.DataTasks$.asObservable();
  }
  get LoadingObz$() {
    return this.Loading$.asObservable();
  }
  getTaskByID(data: any) {
    return this.http.getData('/WorkOrder', {
      LocationId: localStorage.getItem('defaultLocation'),
      ...data,
    });
  }

  // un select WorkOrder
  setActionUnSelected(ID: any) {
    this.ActionUnSelected$.next(ID);
  }
  get ActionUnSelected() {
    return this.ActionUnSelected$.asObservable();
  }

  //  Actions on Selected
  // Change Status
  ChangeStatus(body: any) {
    if (body?.statusId == 2) {
      return this.http
        .saveFormDate('/AppWorkOrders/TechnicalInprocess', {
          LocationId: localStorage.getItem('defaultLocation'),
          Lan:
            this.LocationForUser?.coords?.longitude ||
            localStorage.getItem('longitude'),
          Lat:
            this.LocationForUser?.coords?.latitude ||
            localStorage.getItem('latitude'),
          WorkOrderid: body.ids,
          StatusNotes: 'In Process',
        })
        .pipe(
          map((value: any) => {
            return {
              ...value,
              rv: 1,
              Msg: value?.Message,
            };
          })
        );
    } else {
      return this.http.saveData('/WorkOrder/Status', body);
    }
  }
  ChangeToPending(body: any) {
    return this.http.saveData('/AppWorkOrders/Pending', {
      LocationId: localStorage.getItem('defaultLocation'),
      ...body,
    });
  }

  // Change Status
  CalenderUpateDate(body: any) {
    return this.http.saveData('/WorkOrder/CalenderUpateDate', body);
  }
  // Change DueDate
  ChangeDueDate(body: any) {
    return this.http.saveData('/WorkOrder/DueDate', body);
  }
  // Change Priority
  ChangePriority(body: any) {
    return this.http.saveData('/WorkOrder/Priority', body);
  }
  // Change Priority
  deleteSelected(body: any) {
    return this.http.deleteDate('/WorkOrder', body);
  }
  //add  TimeLogs
  addTimeLogs(body: any) {
    return this.http.saveData('/WorkOrder/TimeLogs', body);
  }

  // add instruction
  addInStruction(body: any) {
    return this.http.saveData('/WorkOrder/SOP', {
      ...body,
      workOrderId: this.WorkOrderOpened?.ID,
    });
  }

  // get instruction
  getInStruction() {
    this.dataInStructionView$.next(false);
    this.dataInStructionEdit$.next(false);

    return this.http
      .getData('/WorkOrder/SOP', {
        workOrderId: this.WorkOrderOpened?.ID,
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
        this.dataInStructionView$.next(value);
      });
  }
  get dataInStructionEditObz$() {
    return this.dataInStructionEdit$.asObservable();
  }
  get dataInStructionViewObz$() {
    return this.dataInStructionView$.asObservable();
  }
  setdataFromEditToView(data: any) {
    this.dataInStructionView$.next(data);
  }
  deleteChildrenTypeOptionForView(data: any) {
    const searchTree = (element: any) => {
      if (element.data.FieldTypeId == 7) {
        const valueField = element.data.Value;
        if (valueField) {
          const children = element.option.find(
            (value: any) => value.ID == valueField
          )?.option;
          element.children = children;
        } else {
          element.children = [];
        }
      } else if (element.children != null) {
        var i;
        var result: any = null;
        for (i = 0; result == null && i < element.children.length; i++) {
          result = searchTree(element.children[i]);
        }
        return result;
      }
      return null;
    };
    if (data.length) {
      data.forEach((value: any) => {
        searchTree(value);
      });
    }
    return data;
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
  // add New Value To Inst Type File
  addNewValueToInstTypeFile(body: any) {
    return this.http.saveFormDate('/WorkOrder/S3SOPFieldsFile', body);
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

  // Instruction Completed
  InstructionCompleted(body: any) {
    return this.http.saveData('/WorkOrder/SOPComplete', body);
  }
  Reject(body: any) {
    return this.http.saveData('/WorkOrder/SOPReject', body);
  }
  TC(body: any) {
    return this.http.saveFormDate('/AppWorkOrders/TechnicalCompleteTask', {
      ...body,
      LocationId: localStorage.getItem('defaultLocation'),
      Lan:
        this.LocationForUser.coords.longitude ||
        localStorage.getItem('longitude'),
      Lat:
        this.LocationForUser.coords.latitude ||
        localStorage.getItem('latitude'),
    });
  }
  ReOpen(body: any) {
    return this.http.saveData('/WorkOrder/SOPReOpen', body);
  }

  linkWithPurchaseOrder(notes: any, bodyItems: any[]) {
    return this.http
      .saveData('/Procurement/Request', {
        notes: notes,
        requestWOId: this.WorkOrderOpened.ID,
        poName: this.WorkOrderOpened.TaskName,
        LocationId: localStorage.getItem('defaultLocation'),
      })
      .pipe(
        switchMap((valueRequest: any) => {
          return this.http.saveDataArray(
            '/Procurement/OrderItem',
            bodyItems.map((value) => {
              return { ...value, poId: valueRequest.rv };
            })
          );
        })
      );
  }
  deleteOrder(ID: number) {
    return this.http.deleteDate('/Procurement/Order', { ID: ID });
  }
  deleteSparePart(item: any) {
    return this.http
      .deleteDate('/WorkOrder/Parts', {
        ...item,
        WorkOrderId: this.WorkOrderOpened.ID,
      })
      .pipe(tap((val) => {}));
  }
  deleteFileInSop(body: any) {
    return this.http.deleteDate('/WorkOrder/WorkOrderSOPFiles', body);
  }
  linkpartWithWorkOrder(body: any[]) {
    const arr = body.map((value) => {
      return {
        ...value,
        workOrderId: this.WorkOrderOpened.ID,
      };
    });
    return this.http.saveDataArray('/WorkOrder/Parts', arr);
  }

  getDataForExcel(params?: any) {
    this.http
      .ExportToExcel('/WorkOrder/list', {
        ...params,
        RowCount: 2002153,
        LocationId: localStorage.getItem('defaultLocation'),
      })
      .subscribe();
  }
  printReport(body: any) {
    return this.http.getBlob('/AllReports/Print', {
      ...body,
      LocationId: localStorage.getItem('defaultLocation'),
    });
  }
  DataTasksForReportSub: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  DataTasksForReport$ = this.DataTasksForReportSub.asObservable();
  FilterReport: any;
  getAllTaskForReport() {
    let filterReport = { ...this.FilterReport };
    delete filterReport?.description;
    this.DataTasksForReportSub.next(undefined);
    this.http
      .getData('/WorkOrder', {
        LocationId: localStorage.getItem('defaultLocation'),
        ...filterReport,
      })
      .pipe(map((value) => value.Data))
      .subscribe((value) => {
        this.DataTasksForReportSub.next(value);
      });
  }
  getSettingReportByLocation() {
    return this.http.getData('/Location/LocationReportSetting', {
      LocationId: localStorage.getItem('defaultLocation'),
    });
  }
  DateAndTime = new BehaviorSubject<any>(undefined);

  getDate() {
    this.http
      .getData('/Code/CurrentDateTime', {
        LocationId: localStorage.getItem('defaultLocation'),
      })
      .subscribe((val) => {
        this.DateAndTime.next(val.CurrentDate);
      });
  }
  DateAndTime$ = this.DateAndTime.asObservable();

  PrintWorkOrder(body: any) {
    return this.http.getBlob('/AllReports/WOPrint', {
      // ReportName: 'WorkOrder',
      // WorkOrderId: this.WorkOrderOpened.ID,
      ...body,
      LocationId: localStorage.getItem('defaultLocation'),
    });
  }
  Dateschedule = new BehaviorSubject<any>(undefined);

  getDateschedule() {
    this.http
      .getData('/PreventiveMaintenance/UpComingTimeSchedules', {
        LocationId: localStorage.getItem('defaultLocation'),
      })
      .subscribe((val) => {
        this.Dateschedule.next(val.CurrentDate);
      });
  }
  Dateschedule$ = this.Dateschedule.asObservable();
  saveClientAcceptance(body: any) {
    return this.http.saveData(`/WorkOrder/ClientAcceptWO`, {
      ...body,
      LocationId: JSON.parse(localStorage.getItem('defaultLocation')!),
      WorkOrder: this.WorkOrderOpened.ID,
    });
  }

  printWeekly(body: any) {
    return this.http.getBlob('/AllReports/WOPrint', {
      ...body,
      LocationId: localStorage.getItem('defaultLocation'),
    });
  }
}
