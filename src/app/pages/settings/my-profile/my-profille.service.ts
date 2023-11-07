import { AuthService } from './../../../modules/auth/services/auth.service';
import { environment } from './../../../../environments/environment';
import { HttpService } from './../../../modules/auth/services/http.service';
import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: "root" })
export class MyProfileService {
  constructor(private http: HttpService,private httpp:HttpClient,private auth: AuthService) {}
  private readonly baseUrl: string = environment.baseUrl;

  saveEdit(body: any) {
    return this.http.saveData(`/UsersProfile`, body);
  }
  getDataProfile() {
    return this.http.getData("/UsersProfile");
  }
  EditCanvas(SigFile: File) {
    let formData: FormData = new FormData();
    formData.append("Signature", SigFile);
    return this.httpp.post(this.baseUrl + "/UsersProfile/Signature", formData, { headers: this.auth.getHeaders() });
  }
  saveImageProfile(Img:File){
    let  formData = new FormData();
    formData.append("Avatar", Img)

    return this.httpp.post(this.baseUrl + "/UsersProfile/Avatar", formData, { headers: this.auth.getHeaders() });
  }
}
