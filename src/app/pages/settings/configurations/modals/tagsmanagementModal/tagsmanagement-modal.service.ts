import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpService } from 'src/app/modules/auth/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class TagsmanagementModalService {
  constructor(private http: HttpService) {}
  // data Tags
  getTags() {
    return this.http.getData('/Configuration/TaskTags');
  }
  //  Add Tags
  AddTags(body: any) {
    return this.http.saveDataArray('/Configuration/TaskTags', body);
  }
  //  Delete Tags
  DeleteTags(Params: any) {
    return this.http.deleteDate('/Configuration/TaskTags', Params);
  }
  locationList = new BehaviorSubject<any>(undefined);
  locationList$ = this.locationList.asObservable();
  getLocation() {
    this.http.getData('/Location/List').subscribe((value) => {
      this.locationList.next(value);
    });
  }
}
