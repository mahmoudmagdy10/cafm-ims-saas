import { map } from 'rxjs/operators';
import { BehaviorSubject, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/modules/auth/services/http.service';

@Injectable({ providedIn: 'root' })
export class UsersAndTeamsService {
  userSignatures: any = new BehaviorSubject([]);
  userSignatures$ = this.userSignatures.asObservable();
  constructor(private http: HttpService) {}
  SaveUsersAndTeamsSelected(body: any, skipInterceptor: string) {
    return this.http.saveDataArray(
      '/General/Assignments',
      body,
      skipInterceptor
    );
  }
  // get UsersAndTeams By AssignmentId
  getUsersAndTeamsByAsID(ID?: any) {
    const params = {
      LocationId: localStorage.getItem('defaultLocation'),
      AssignmentId: ID,
    };
    return this.http
      .getData('/General/Assignments', params)
      .pipe(map((value) => value[0]));
  }

  getUsersAndTeamsSelectedJobtitles(body: any) {
    this.http.getData(
      '/Users/Jobtitles', body
    ).subscribe(res=> this.userSignatures.next(res))
  }
}
