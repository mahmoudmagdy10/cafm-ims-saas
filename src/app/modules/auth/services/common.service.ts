import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class CommonService {
  readonly baseUrl: string = environment.baseUrl + '/AppGeneral/';

  constructor(private http: HttpClient, private auth: AuthService) {}

  search(
    resourceName: string,
    key: string,
    Center?: any,
    UrlEndPoint?: string | null
  ) {
    Center = +Center > -1 ? '&Center=' + Center : '';
    UrlEndPoint =
      UrlEndPoint != null && UrlEndPoint.length > 0
        ? environment.baseUrl + UrlEndPoint
        : this.baseUrl;
    return this.http
      .get<any[]>(
        UrlEndPoint +
          `Search?TableName=${resourceName}&Key=${key}&LocationId=${localStorage.getItem(
            'defaultLocation'
          )}&CurrentPage=${1}&RowCount=${1000}`,
        {
          headers: this.auth.getHeaders(),
        }
      )
      .pipe(map((value: any) => value?.Result?.Data));
  }

  searchPNA(fName: string, sName: string, tName: string, famName: string) {
    return this.http.get(
      this.baseUrl +
        `?Fname=${fName}&Sname=${sName}&Tname=${tName}&Famname=${famName}`,
      {
        // headers: this.auth.getHeaders()
      }
    );
  }

  sendSMS(pageName: string, serials: string, message: string) {
    return this.http.post(
      this.baseUrl + 'SendSMS',
      { pageName, serials, message },
      {
        // headers: this.auth.getHeaders()
      }
    );
  }

  convartDataCase(body: any) {
    let newBody: any = {};
    Object.keys(body).forEach((key) => {
      if (key == 'MS') {
        newBody['ms'] = body[key];
      } else if (key == 'ID') {
        newBody['id'] = body[key];
      } else {
        let keyList = key.split('');
        keyList[0] = keyList[0].toLowerCase();
        const newKey = keyList.join('');
        newBody[newKey] = body[key];
      }
    });
    return newBody;
  }
}
