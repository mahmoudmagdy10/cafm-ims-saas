import { getDate } from 'ngx-bootstrap/chronos/utils/date-getters';
import { HttpService } from './../../modules/auth/services/http.service';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MaintenanceRequestService {
  submited$: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  constructor(private http: HttpService) {}
  // data WorkRequestGates
  getWorkRequest(params: any) {
    return this.http.getData('/WorkRequests', params);
  }
  getCodeWorkRequest(LocationId: any) {
    const params = {
      LocationId: LocationId,
      ScreenName: 'WorkRequestGates',
    };
    return this.http.getData('/Code/wr', params).pipe(
      map((code: any) => {
        return {
          ...code,
          AssetId: code.AssetId?.map((value: any) => {
            return {
              ...value,
              label: value.AssetName,
              key: value.AssetName,
              data: 'Documents Folder',
              expandedIcon: 'pi pi-folder-open',
              collapsedIcon: 'pi pi-folder',
            };
          }),
        };
      })
    );
  }
  // post WorkRequestGates
  SaveWorkRequest(body: any) {
    return this.http.saveData('/WorkRequests/SaveByCode', body)
  }
  // feild
  addFieldAsset(body: any) {
    return this.http.saveData('/Components/Fields', {
      ...body,
      ComponentType: 'WorkRequestGates',
    });
  }
  getAssetByCode(Code: any) {
    return this.http.getData('/Assets/AssetByCode', { AssetId: Code });
  }
}
