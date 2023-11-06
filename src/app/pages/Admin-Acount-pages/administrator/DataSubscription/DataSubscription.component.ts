import { UntypedFormControl, NgForm, UntypedFormGroup, Validators } from '@angular/forms';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { NgModule } from '@angular/core';
import { administratorModule } from '../administrator.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { administratorService } from '../administrator.service';
import * as moment from 'moment';

@Component({
  selector: 'app-DataSubscription',
  templateUrl: './DataSubscription.component.html',
  styleUrls: ['./DataSubscription.component.scss'],
})
export class DataSubscriptionComponent implements OnInit, OnChanges {
  @Input('Codes') Codes: any;
  @Input('SubscriptionByID') SubscriptionByID: any[];
  @Input('idCom') idCom: any;

  @Output() afterSaveSub: EventEmitter<any> = new EventEmitter();
  @Output() afterEditSub: EventEmitter<any> = new EventEmitter();
  @Output() cancel: EventEmitter<any> = new EventEmitter();

  submitted: boolean = false;
  DataServices: any[];

  ServicesID: any[] = [];
  Subid: any;
  minDate: Date = new Date();
  constructor(
    public administratorService: administratorService,
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
    // ServicesID: new FormControl(),
  });

  ngOnInit() {}
  ngOnChanges(changes: SimpleChanges): void {
    this.Codes?.ServicesId.forEach((element: any) => {
      element.checked = false;
    });

    this.Codes?.ServicesId.forEach((element: any) => {
      element.checked = false;
    });
    this.DataSubscriptionForm.reset();
  }

  AddDataSubscription() {
    if (this.SubscriptionByID) {
      const body = {
        ...this.DataSubscriptionForm.value,
        StartDate: this.DataSubscriptionForm.value.StartDate,
        EndDate: this.DataSubscriptionForm.value.EndDate,
        CompanyId: this.idCom,
        ServicesID: this.ServicesID.join(','),
        subscriptionId: this.SubscriptionByID[0].SubscriptionId,
      };

      this.administratorService
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

      this.administratorService
        .addSubscription(body)
        .subscribe((datasub: any) => {
          if (datasub.rv > 0) {
            this.toastr.success(datasub.Msg);
            this.afterSaveSub.emit();
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
        if (element.ServiceId == id) {
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
    if (!checked) {
      this.ServicesID = [];
    }
  }
  onCancel() {
    this.cancel.emit();
  }
}
