import { environment } from 'src/environments/environment';
import { HttpService } from './../../../../../../modules/auth/services/http.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserInnerService {
  constructor(private http: HttpService) {}
  Avatar=environment.Avatar

  // convert Language
  convertLanguage(Lang: string) {
    return this.http.saveData('/UsersProfile/Language', {
      languageCode: Lang,
    });
  }
}
