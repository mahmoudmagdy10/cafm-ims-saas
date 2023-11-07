import { saveAs } from 'file-saver';
import { tap, map } from 'rxjs/operators';
import { environment } from './../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import * as moment from 'moment';
import * as XLSX from 'xlsx';
import { FileSaverService } from 'ngx-filesaver';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class HttpService {
  private readonly baseUrl: string = environment.baseUrl;

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private fileSaver: FileSaverService,
    private toastr: ToastrService
  ) {}

  getData(route: string, params: any = null) {
    return this.http.get<any>(this.baseUrl + route, {
      params: this.convartParams(params),
      headers: this.auth.getHeaders(),
    });
  }
  downloadExcel(data: any, Name: string) {
    const EXCEL_TYPE =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const EXCEL_EXTENSION = '.xlsx';
    const workSheet = XLSX.utils.json_to_sheet(data);
    const workBook = {
      Sheets: {
        testingSheet: workSheet,
      },
      SheetNames: ['testingSheet'],
    };
    const excelBuffer = XLSX.write(workBook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const blobData = new Blob([excelBuffer], {
      type: EXCEL_TYPE,
    });
    saveAs(blobData, Name);
  }
  ExportToExcel(route: string, params: any = null, name?: string) {
    return this.http
      .get<any>(this.baseUrl + route, {
        params: this.convartParams(params),
        headers: this.auth.getHeaders(),
      })
      .pipe(
        tap((value) => {
          var data: any;
          if (value instanceof Object) {
            data = value.Data;
          }
          if (value instanceof Array) {
            data = value;
          }

          data.forEach((val: any, index: any) => {
            Object.keys(val).forEach((key: any) => {
              if (val[key] instanceof Array) {
                let arraySplitted = '';
                val[key].forEach((res: any) => {
                  Object.keys(res).forEach((Key: string) => {
                    if (Key.includes('Name')) {
                      arraySplitted = arraySplitted + res[Key] + ',';
                    }
                  });
                });

                data[index][key] = arraySplitted;
              }
            });
          });
          const EXCEL_TYPE =
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
          const EXCEL_EXTENSION = '.xlsx';

          const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
          const workbook: XLSX.WorkBook = {
            Sheets: { data: worksheet },
            SheetNames: ['data'],
          };
          const excelBuffer: any = XLSX.write(workbook, {
            bookType: 'xlsx',
            type: 'array',
          });
          const url: string = window.location.href;
          const file: Blob = new Blob([excelBuffer], {
            type: EXCEL_TYPE,
          });
          this.fileSaver.save(file, url.split('/').pop() + EXCEL_EXTENSION);
        })
      );
  }

  saveData(route: string, body: any, header?: any) {
    return this.http.post(this.baseUrl + route, this.convartData(body), {
      headers: this.auth.getHeaders(header),
    });
  }
  saveDataInParam(route: string, body: any, header?: any) {
    return this.http.post(
      this.baseUrl + route,
      {},
      {
        headers: this.auth.getHeaders(header),
        params: this.convartParams(body),
      }
    );
  }
  download(route: string, body: any) {
    return this.http.post(this.baseUrl + route, this.convartData(body), {
      headers: this.auth.getHeaders(),
      responseType: 'blob' as 'json',
    });
  }
  saveDataWithOutMapping(route: string, body: any) {
    return this.http.post(this.baseUrl + route, body, {
      headers: this.auth.getHeaders(),
    });
  }
  saveDataArray(route: string, body: any[], skipInterceptor?: string) {
    return this.http.post(this.baseUrl + route, body, {
      headers: this.auth.getHeaders(),
    });
  }
  deleteDate(route: string, params: any = null) {
    return this.http.delete(this.baseUrl + route, {
      params: this.convartParams(params),

      headers: this.auth.getHeaders(),
    });
  }
  private getOutputType(t: string) {
    switch (t) {
      case 'p':
        return 'application/pdf';
      case 'w':
        return 'application/msword';
      case 'e':
        return 'application/vnd.ms-excel';
      default:
        return 'application/pdf';
    }
  }

  getBlob(route: string, params: any = null, type: string = 'p') {
    return this.http
      .get(this.baseUrl + route, {
        params: this.convartParams(params),
        responseType: 'blob' as 'json',
        headers: this.auth.getHeaders(),
      })
      .pipe(
        tap((f: any) => {
          let reader = new FileReader();
          reader.onload = (e) => {
            let value; // Define the variable 'value' here
            try {
              value = JSON.parse((<any>e.target).result);
              if (value!.rv > 0 && (value!.Msg || value!.msg)) {
                this.toastr.success(value!.Msg || value!.msg);
              } else if (value!.rv < 1 && (value!.Msg || value!.msg)) {
                this.toastr.error(value!.Msg || value!.msg);
              }
            } catch (error) {
              if (f && f != '') {
                let blob = new Blob([f], {
                  type: this.getOutputType(type),
                });

                if (value && value.rv < 1) {
                  // Handle the case where there are no records available
                  this.toastr.error(value.Msg || 'No records available');
                } else {
                  // Open the URL only if there are records available
                  let url = window.URL.createObjectURL(blob);
                  let pwa = window.open(url);
                  if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
                    // Handle the case when the window couldn't be opened
                    // this.toastr.error('Unable to open the file');
                  }
                }
              }
            }
          };
          reader.readAsText(f);
        })
      );
  }

  getBase46(route: string, params: any = null) {
    return this.http.get(this.baseUrl + route, {
      params: this.convartParams(params),
      headers: this.auth.getHeaders(),
    });
  }

  saveFormDate(route: string, body: any) {
    const data = new FormData();
    Object.keys(body).forEach((key) => {
      if (body[key] instanceof Date)
        body[key] = moment(body[key]).format('YYYY-MM-DD');
      if (body[key] instanceof Array) {
        body[key].forEach((element: any) => {
          data.append(key, element);
        });
      } else if (body[key] == null) delete body[key];
      else {
        data.append(key, body[key]);
      }
    });

    return this.http.post(this.baseUrl + route, data, {
      headers: this.auth.getHeaders(),
    });
  }

  private convartData(body: any) {
    let newValue = { ...body };
    Object.keys(newValue).forEach((key) => {
      if (moment.isMoment(newValue[key]))
        newValue[key] = newValue[key].toDate();
      if (newValue[key] instanceof Date)
        newValue[key] = moment(newValue[key]).format('YYYY-MM-DD');
      if (newValue[key] == null) delete newValue[key];
    });
    return newValue;
  }

  private convartParams(params: any): any {
    if (params) {
      let newParams = this.convartData(params);
      let httpParams = new HttpParams();
      Object.keys(newParams).forEach(function (key) {
        httpParams = httpParams.set(key, newParams[key]);
      });
      return httpParams;
    } else {
      return null;
    }
  }
}
