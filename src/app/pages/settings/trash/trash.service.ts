import { HttpService } from './../../../modules/auth/services/http.service';

import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class RecycleBinService {
  constructor(private http: HttpService) { }

  getCodeRecycleBin() {
    const params = {
      ScreenName: 'RecycleBin',
      LocationId:localStorage.getItem("defaultLocation")
    }
    return this.http.getData("/Code", params)
  }
  getRecycleBin(params: any) {
    return this.http.getData("/RecycleBin", params)
  }
  ActionRecycleBin(body: any) {
    return this.http.saveData("/RecycleBin", body)
  }

}
