import { map, distinctUntilChanged } from 'rxjs/operators';
import { HttpService } from './../../../modules/auth/services/http.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LogsByComponentTypeService {
  constructor(private http: HttpService) {}
  store = new BehaviorSubject<{
    [ComponentType: string]: FieldManagmentModel;
  }>({});
  store$: Observable<{
    [ComponentType: string]: FieldManagmentModel;
  }> = this.store.asObservable();

  createInitValueForStore(ComponentType: string) {
    this.updateStore(ComponentType, {
      Logs: {
        Data: [],
        Setting: undefined,
        loading: false,
      },
      params: {},
    });
  }
  SelectorByComponent$(SelectorKey: string, ComponentType: string) {
    return this.store$.pipe(
      map((value: any) => value?.[ComponentType]?.[SelectorKey]),
      distinctUntilChanged()
    );
  }
  updateStore(ComponentType: any, newState: FieldManagmentModel) {
    let store = this.store.value;
    store[ComponentType] = { ...store[ComponentType], ...newState };
    let newStore = store;
    this.store.next(newStore);
  }
  getLogsByComponentType(ComponentType: any) {
    this.updateStore(ComponentType, {
      Logs: {
        Data: [],
        Setting: undefined,
        loading: false,
      },
    });
    this.http
      .getData('/Applog/List', {
        ...this.store.value[ComponentType]['params'],
      })
      .subscribe((value) => {
        this.updateStore(ComponentType, {
          Logs: {
            Data: value?.Result?.Data,
            Setting: value?.Result?.Setting,
            loading: false,
          },
        });
      });
  }
  startUse(ComponentType: string, Id: any) {
    this?.createInitValueForStore(ComponentType);
    this.updateStore(ComponentType, {
      params: {
        logType: ComponentType,
        Id: Id,
        CurrentPage: 1,
        RowCount: 10,
      },
    });
    this.getLogsByComponentType(ComponentType);
  }
}
export interface FieldManagmentModel {
  Logs?: { Data: any; Setting: any; loading: boolean };
  params?: any;
}
