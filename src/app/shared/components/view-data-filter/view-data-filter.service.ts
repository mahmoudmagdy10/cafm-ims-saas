import { HttpService } from './../../../modules/auth/services/http.service';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ViewDataFilterService {
  filter = new BehaviorSubject<{
    [ComponentType: string]: filterViewModel;
  }>({});
  filter$: Observable<{
    [ComponentType: string]: filterViewModel;
  }> = this.filter.asObservable();

  get datafilterModel() {
    return this.filter.value;
  }
  createInitValueForFilter(ComponentType: string) {
    this.updateFilter(ComponentType, {
      dataFilter: { forview: [], params: {} },
      openCardFilter: '',
    });
  }
  SelectorFilterByComponent$(ComponentType: string, SelectorKey: string) {
    return this.filter$.pipe(
      map((value: any) => value?.[ComponentType]?.[SelectorKey]),
      distinctUntilChanged()
    );
  }
  updateFilter(ComponentType: any, newState: filterViewModel) {
    let filter = this.filter.value;
    filter[ComponentType] = { ...filter[ComponentType], ...newState };
    let newStore = filter;
    this.filter.next(newStore);
  }

  setDataFilter(ComponentType: any, dataFilter: { forview: []; params: any }) {
    this.updateFilter(ComponentType, { dataFilter: dataFilter });
  }
  updateParams(ComponentType: any, params: any) {
    this.setDataFilter(ComponentType, {
      forview: this.datafilterModel?.['ComponentType']?.dataFilter?.forview!,
      params: {
        ...this.datafilterModel?.['ComponentType']?.dataFilter?.params!,
        ...params,
      },
    });
  }
  clearFilter(ComponentType: any) {
    this.updateFilter(ComponentType, {
      dataFilter: { forview: [], params: {} },
    });
  }
  openCardFilter(ComponentType: any) {
    this.updateFilter(ComponentType, { openCardFilter: Math.random() });
  }

  constructor() {}
}
export interface filterViewModel {
  dataFilter?: { forview: []; params: any };
  openCardFilter?: any;
}
