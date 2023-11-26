import { map } from 'rxjs/operators';
import { HttpService } from 'src/app/modules/auth/services/http.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FieldManagmentService {
  dataFeilds$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  Code$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  ComponentType: string = '';
  pagePermissionSub: BehaviorSubject<any> = new BehaviorSubject<any>({
    CommonFieldsDelete: true,
    CommonFieldsEdit: true,
  });
  pagePermission$ = this.pagePermissionSub.asObservable();
  constructor(private http: HttpService) {}

  getFeild() {
    const body = {
      LocationId: localStorage.getItem('defaultLocation'),
      ComponentType: this.ComponentType || 'Assets',
    };
    this.http.getData('/Components/CommonFields', body).subscribe((value) => {
      this.dataFeilds$.next(value);
    });
  }
  get DataFeild$(): Observable<any> {
    return this.dataFeilds$.asObservable();
  }
  //delete Common  Feild
  deleteCommonFeild(body: any) {
    return this.http.deleteDate('/Components/CommonFields', {
      ...body,
      ComponentType: this.ComponentType,
    });
  }
  //get Feild ById
  getFeildById(id: any) {
    const body = {
      LocationId: localStorage.getItem('defaultLocation'),
      ID: id,
      ComponentType: this.ComponentType,
    };
    return this.http.getData('/Components/CommonFields', body);
  }
  // Common Feild
  addCommonFeild(body: any) {
    return this.http.saveData('/Components/CommonFields', {
      ...body,
      ComponentType: this.ComponentType,
    });
  }
  //  Add Catigories In Asset
  AddCategories(Name: any, ID: any) {
    return this.http.saveData('/Components/Categories', {
      id: ID,
      categoryName: Name,
      ComponentType: this.ComponentType,
    });
  }
  //  Delete Catigories In Asset
  DeleteCategories(Params: any) {
    return this.http.deleteDate('/Components/Categories', Params);
  }

  get CodeObz$() {
    return this.Code$.asObservable();
  }
  set ChangeCode$(codes: any) {
    this.Code$.next(codes);
  }
  AddParentField(body: any) {
    return this.http.saveData(`/Components/CommonFieldsParent?LocationId=${body?.LocationId}&ComponentId=${body?.ComponentId}&ParentId=${body?.ParentId}&ParentValue=${body?.ParentValue}`, {});
  }
}
