import { FormGroup, FormControl } from '@angular/forms';
import { LocationService } from './../../locations.service';
import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';



@Component({
  selector: 'modalchooesusers',
  templateUrl: 'modalchooesusers.component.html',
})




export class modalchooesusersComponent implements OnInit {

  DataUser:any[];
  DataFilter:any[];








// private store:Store<any>

  constructor(private LocationService:LocationService,) { }

  ngOnInit() {
  //  this.store.subscribe
    // this.LocationService.GetUsers().subscribe((value:any)=>{
    //   this.DataUser=value.Data

    // })


  }




}


