import { HttpService } from 'src/app/modules/auth/services/http.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AddActionService {
  constructor(private http: HttpService) {}
  //AddOREdit History Actions
  saveOrEditHistoryActions(body: any) {
    return this.http.saveFormDate('/Components/Log', {
      ...body
    });
  }
}
