import { ToastrService } from 'ngx-toastr';
import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { administratorService } from '../administrator.service';




@Component({
  selector: 'app-ActivisionModule',
  templateUrl: './ActivisionModule.component.html',
})
export class ActivisionModuleComponent implements OnInit {

  @Input('itemActivision') itemActivision: any
  @Output() afterChangeStatus: EventEmitter<any> = new EventEmitter();
  @Output() cancel: EventEmitter<any> = new EventEmitter();



  constructor(public administratorService: administratorService, private toastr: ToastrService) { }

  ngOnInit() {
  }
  ChangeStatus(status: boolean) {
    const body = {
      "companyId": this.itemActivision.CompanyId,
      "enable": status
    }
    this.administratorService.StatusCam(body).subscribe((res: any) => {
      if (res.rv > 0) {

        this.afterChangeStatus.emit(status);

      } else {


      }
    })


  }
onCancel(){
  this.cancel.emit(status);

}
}

