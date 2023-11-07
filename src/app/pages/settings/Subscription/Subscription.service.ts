import { HttpService } from './../../../modules/auth/services/http.service';
import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
@Injectable({ providedIn: "root" })
export class SubscriptionService {


  constructor(private http: HttpService) { }



  getCodeSubscription() {
    return this.http.getData("/Code?ScreenName=Subscriptions")
  }

 addSubscription(body: any) {
    return this.http.saveData("/Subscription/Subscription", body)
  }
  getSubscriptionByComID(id: any) {
    var ID=id?id:''
    return this.http.getData("/Subscription/Subscription?CompanyId=" + ID   );
  }

  getSubscriptionByID(idSup: any, idCom: any) {
    return this.http.getData("/Subscription/Subscription?SubscriptionId=" + idSup + '&CompanyId=' + idCom);
  }
}







