import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'UnderConstruction',
  templateUrl: 'UnderConstruction.component.html',
})
export class UnderConstructionComponent implements OnInit {

  constructor(private toastr: ToastrService,) { }

  ngOnInit(): void { }


}




