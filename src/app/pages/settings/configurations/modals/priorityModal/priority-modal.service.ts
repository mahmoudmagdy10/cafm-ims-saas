import { HttpService } from './../../../../../modules/auth/services/http.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PriorityModalService {
  constructor(private http: HttpService) {}
  // data praiorty
  getPraiorty() {
    return this.http.getData('/Configuration/TaskPriorities');
  }
  //  Add praiorty
  Addpraiorty(body: any) {
    return this.http.saveDataArray('/Configuration/TaskPriorities', body);
  }
  //  Delete praiorty
  Deletepraiorty(Params: any) {
    return this.http.deleteDate('/Configuration/TaskPriorities', Params);
  }
}
