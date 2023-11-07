
import { HttpService } from './../../../modules/auth/services/http.service';
import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class CompaniesTeamsService {
  constructor(private http: HttpService) { }

  getMember() {
    const params = {
      LocationId: localStorage.getItem("defaultLocation"),
      ScreenName: 'Teams'
    }
    return this.http.getData("/Code", params)
  }



  getDataCompaniesTeams() {
    const params = {
      LocationId: localStorage.getItem("defaultLocation")
    }
    return this.http.getData("/CompaniesTeams", params);

  }

  addCompaniesTeams(body: any) {
    return this.http.saveData("/CompaniesTeams", body)
  }
  deleteCompaniesTeams(id: any) {
    return this.http.deleteDate(`/CompaniesTeams?TeamId=${id}`)

  }
  GetDataById(id: any) {
    return this.http.getData('/CompaniesTeams?LocationId=' + localStorage.getItem("defaultLocation") + '&TeamId=' + id);


  }
  deleteMemberforTeam(TeamId: any, UserId: any) {
    return this.http.deleteDate(`/CompaniesTeams/Memeber?TeamId=${TeamId}&UserId=${UserId}`)

  }
  addMemberforTeam(body: any) {
    return this.http.saveData("/CompaniesTeams/Memeber", body)
  }
}
