import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { UsersService } from '../../users.service';
@Component({
  selector: 'modal3',
  templateUrl: 'modal3.component.html',
})
export class modal3Component implements OnInit{
  @Output() afterSave: EventEmitter<any> = new EventEmitter();
  @Input("dataUser") dataUser: any;
  constructor(private usersService: UsersService, private toastr: ToastrService,) { }

  ngOnInit(): void {}
  ChangeStatus(event:boolean){
      if(event){
        this.usersService.isEmailNotification
    ({
      isEmailNotification: !this.dataUser.IsEmailNotification,
      userId: this.dataUser.UserId
    })
    .subscribe((res: any) => {
      if (res.rv > 0) {

        this.afterSave.emit();
      } else {


      }
    })}else{
      this.afterSave.emit();
    }

  }
  }




