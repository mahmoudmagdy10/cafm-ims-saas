import { SubscriptionService } from '../Subscription.service';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'CreateOrEditSub',
  templateUrl: './CreateOrEditSub.component.html',
  styleUrls: ['./CreateOrEditSub.component.scss'],
})
export class CreateOrEditSubComponent implements OnInit, OnChanges {
  @Input('Codes') Codes: any;
  @Input('SubscriptionByID') SubscriptionByID: any;
  @Input('idCom') idCom: any;

  @Output() Cancel: EventEmitter<any> = new EventEmitter();
  @Output() afterEditSub: EventEmitter<any> = new EventEmitter();

  submitted: boolean = false;
  DataServices: any[];

  ServicesID: any[] = [];
  Subid: any;

  constructor(
    public subscriptionService: SubscriptionService,
    private toastr: ToastrService
  ) {}

  DataSubscriptionForm = new UntypedFormGroup({
    StartDate: new UntypedFormControl('', [Validators.required]),
    EndDate: new UntypedFormControl('', [Validators.required]),
    CurrencyId: new UntypedFormControl('', [Validators.required]),
    SubscriptionTypeId: new UntypedFormControl('', [Validators.required]),
    SubscriptionStatusId: new UntypedFormControl('', [Validators.required]),
    NumberOfLicenses: new UntypedFormControl(null, [Validators.required]),
    NumberOfAssets: new UntypedFormControl(null, [Validators.required]),
    NumberOfLocations: new UntypedFormControl(null, [Validators.required]),
    TotalCost: new UntypedFormControl(null, [Validators.required]),
  });

  ngOnInit() {
    this.DataSubscriptionForm.get('SubscriptionTypeId')?.valueChanges.subscribe(
      (value) => {

        if (value == 37) {
          this.DataSubscriptionForm.get('TotalCost')?.disable();
        } else {
          this.DataSubscriptionForm.get('TotalCost')?.enable();
        }
      }
    );
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.Codes?.ServicesId.forEach((element: any) => {
      element.checked = false;
    });
    this.ServicesID = [];
    this.DataSubscriptionForm.reset();
    if (this.SubscriptionByID) {
      if (this.SubscriptionByID.Services) {
        this.SubscriptionByID.Services.forEach((element: any) => {
          this.CheckService({ target: { checked: true } }, element.ServiceId);
        });
      }

      this.DataSubscriptionForm.patchValue({
        ...this.SubscriptionByID,
        StartDate: new Date(this.SubscriptionByID.StartDate),
        EndDate: new Date(this.SubscriptionByID.EndDate),
      });
    }
    if (this.idCom) {

    }
  }

  AddDataSubscription() {
    if (this.SubscriptionByID) {


      const body = {
        ...this.DataSubscriptionForm.value,
        StartDate: this.DataSubscriptionForm.value.StartDate,
        EndDate: this.DataSubscriptionForm.value.EndDate,
        CompanyId: this.idCom,
        ServicesID: this.ServicesID.join(','),
        subscriptionId: this.SubscriptionByID.SubscriptionId,
      };

      this.subscriptionService
        .addSubscription(body)
        .subscribe((datasub: any) => {
          if (datasub.rv > 0) {
            this.toastr.success(datasub.Msg);
            this.afterEditSub.emit();
          } else {
            this.toastr.error(datasub.Msg);
          }
        });
    } else {

      const body = {
        ...this.DataSubscriptionForm.value,
        StartDate: this.DataSubscriptionForm.value.StartDate,
        EndDate: this.DataSubscriptionForm.value.EndDate,
        CompanyId: this.idCom,
        ServicesID: this.ServicesID.join(','),
      };

      this.subscriptionService
        .addSubscription(body)
        .subscribe((datasub: any) => {
          if (datasub.rv > 0) {
            this.toastr.success(datasub.Msg);
            this.afterEditSub.emit();
          } else {
            this.toastr.error(datasub.Msg);
          }
        });
    }
  }
  CheckService(event: any, id: any) {

    if (event.target.checked == true) {
      this.ServicesID.push(id);
      this.Codes?.ServicesId.forEach((element: any) => {
        if (element.Code == id) {
          element.checked = true;
        }
      });
    } else {
      this.ServicesID.forEach((element: any, index: any) => {
        if (element == id) {
          this.ServicesID.splice(index, 1);
        }
      });
    }

  }

  CheckAllService(event: any) {
    const checked = event.target.checked;
    this.Codes?.ServicesId.forEach((element: any) => {
      if (checked) {
        if (!element.checked) {
          element.checked = true;
          this.ServicesID.push(element.Code);
        }
      } else {
        if (element.checked) {
          element.checked = false;
        }
      }
    });
    if(!checked){
      this.ServicesID = [];

    }
  }
}
