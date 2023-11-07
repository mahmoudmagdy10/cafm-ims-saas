import { shareReplay } from 'rxjs/operators';
import { HttpService } from 'src/app/modules/auth/services/http.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ViewItemInFieldService {
  ComponentType: string = '';
  constructor(private http: HttpService) {}
  //add field to Item
  addFieldToItem(body: any) {
    return this.http.saveData('/Components/Fields', {
      ...body,
      ComponentType: this.ComponentType,
    });
  }
  addFieldToItemLocations(body: any) {
    return this.http.saveData('/Components/Fields', {
      ...body,
      ComponentType: this.ComponentType || 'Assets',
    });
  }

  addFieldToItemInWrokRequest(body: any) {
    return this.http.saveData('/Components/AnonymousFields', {
      ...body,
      ComponentType: 'WorkrequestGates',
    });
  }
  
  //add field File to Item
  addFieldFileToItemInPublic(body: any) {
    return this.http.saveFormDate('/Components/S3WorkRequestFile', {
      ...body,
      ComponentType: this.ComponentType,
    });
  }
  //add field File to Item
  addFieldFileToItem(body: any) {
    return this.http.saveFormDate('/Components/S3FieldsFile', {
      ...body,
      ComponentType: this.ComponentType,
    });
  }
  //  Fields Shown In Item
  ChangeFieldShown(body: any) {
    return this.http.saveData('/Components/FieldsShown', {
      ...body,
      ComponentType: this.ComponentType,
    });
  }

  // Delete Field In Item
  deleteFieldInItem(Params: any) {
    return this.http.deleteDate('/Components/Fields', {
      ...Params,
      ComponentType: this.ComponentType,
    });
  }

  getFieldsHistroy(params: any) {
    return this.http
      .getData('/Components/FieldsHistroy', {
        ...params,
        ComponentType: 'Assets',
      })
      .pipe(shareReplay(1));
  }
}
