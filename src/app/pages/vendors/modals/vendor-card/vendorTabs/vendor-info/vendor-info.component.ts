import { switchMap, map } from 'rxjs/operators';
import { Subscription, Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { VendorsService } from './../../../../vendors.service';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-vendor-info',
  templateUrl: './vendor-info.component.html',
  styleUrls: ['./vendor-info.component.scss'],
})
export class VendorInfoComponent implements OnInit, OnDestroy {
  vendorForm: UntypedFormGroup;
  @Input() dataCard: any;
  unSubscri: Subscription;
  locationIds: any[] = [];
  Locations$: Observable<any>;
  disable:boolean=false
  constructor(
    private service: VendorsService,
    private fb: UntypedFormBuilder,
    private toastr: ToastrService
  ) {
    this.vendorForm = this.fb.group(
      {
        ID: [''],
        VendorName: [''],
        LicenseNumber: [''],
        ContactPerson: [''],
        Email: [''],
        Phone: [''],
        Address: [''],
        LocationIds: [''],
      },
      { updateOn: 'blur' }
    );
  }
  codes:any
  ngOnInit(): void {
    this.Locations$ = this.service.getCodeObz$().pipe(
      map((codes) => {
        this.codes=codes
        if (codes && !codes?.PagePermissions?.VendorsEdit) {
          this.vendorForm.disable({ emitEvent: false });
          this.disable=true
        }
        if (!this.dataCard.VendorsLocations) {
          this.dataCard.VendorsLocations = [];
        }
        return codes.Location.map((locationInCode: any) => {
          if (
            this.dataCard.VendorsLocations.find(
              (locationCard: any) =>
                locationCard.LocationId == locationInCode.Code
            )
          ) {
            return {
              ...locationInCode,
              checked: true,
            };
          } else {
            return {
              ...locationInCode,
              checked: false,
            };
          }
        });
      })
    );

    this.vendorForm.patchValue({
      ...this.dataCard,
    });
    this.locationIds = this.dataCard.VendorsLocations?.map(
      (value: any) => value.LocationId
    );
    this.vendorForm.get('LocationIds')?.setValue(this.locationIds);

    const formChange$ = this.vendorForm.valueChanges.pipe(
      switchMap((value) => {
        return this.service.AddVendor({
          ...value,
          LocationIds: value.LocationIds ? value.LocationIds.join(',') : '',
        });
      })
    );
    this.unSubscri = formChange$.subscribe(
      (res: any) => {
        if (res.rv > 0) {

        } else {

        }
      },
      (err) => {
        this.toastr.error(err.Msg);
      }
    );
  }
  selectLocaltion(event: any, item: any) {
    if (event.checked) {
      this.locationIds.push(item);
    } else {
      this.locationIds.forEach((value, index) => {
        if (value == item) {
          this.locationIds.splice(index, 1);
        }
      });
    }
    this.vendorForm.get('LocationIds')?.setValue(this.locationIds);
  }
  ngOnDestroy(): void {
    this.unSubscri.unsubscribe();
  }
}
