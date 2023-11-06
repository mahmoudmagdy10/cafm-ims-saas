import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LocationService } from './../../locations.service';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
@Component({
  selector: 'modalAddLocation',
  templateUrl: 'modalAddLocation.component.html',
})
export class modalAddLocation implements OnInit {
  @Input() Codes$: Observable<any>;
  @Output() cancel: EventEmitter<any> = new EventEmitter();
  @Output() afterSave: EventEmitter<any> = new EventEmitter();

  constructor(private locationService: LocationService, private toster: ToastrService) { }
  form = new UntypedFormGroup({
    locationName: new UntypedFormControl(null, Validators.required),
    timeZoneId: new UntypedFormControl(null, Validators.required),
  })
  ngOnInit(): void {

  }
  onAddLocation() {
    if (this.form.valid) {
      this.locationService.addLocation({ ... this.form.value }).subscribe((res: any) => {
        // debugger;
        if (res.rv > 0) {
          // window.location.reload();
          this.afterSave.emit(true);
          this.form.reset();
        } else {
          this.toster.error(res.Msg);

        }
      })
    } else {
      this.toster.error(document.dir=='rtl'?'يرجى ادخال الحقول المطلوبة':'Enter All Field Required');
    }
  }
  onCancel() {
    this.cancel.emit();
  }


}
