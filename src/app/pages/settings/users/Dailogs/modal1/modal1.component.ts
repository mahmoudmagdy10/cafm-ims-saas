import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { UsersService } from '../../users.service';
@Component({
  selector: 'modal1',
  templateUrl: 'modal1.component.html',
})
export class modal1Component implements OnInit{
  @Output() afterSave: EventEmitter<any> = new EventEmitter();
  @Input("dataUser") dataUser: any;
  constructor(private usersService: UsersService, private toastr: ToastrService,) { }

  ngOnInit(): void {}
  ChangeStatus(event:boolean){
      if(event){ this.usersService.userStatusId
    ({
      "userStatusId": this.dataUser.UserStatusId == 1 ? 2 : 1,
      "userId": this.dataUser.UserId
    })
    .subscribe((res: any) => {
      if (res.rv > 0) {

        this.afterSave.emit(true);
      } else {


      }
    })}else{
      this.afterSave.emit();
    }

  }
  }




