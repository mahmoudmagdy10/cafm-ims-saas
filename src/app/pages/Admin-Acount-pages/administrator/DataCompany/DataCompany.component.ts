import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { NgModule } from '@angular/core';
import { administratorModule } from '../administrator.module';
import {
  UntypedFormGroup,
  UntypedFormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { administratorService } from '../administrator.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-DataCompany',
  templateUrl: './DataCompany.component.html',
})
export class DataCompanyComponent implements OnInit, OnChanges {
  @Input('Codes') Codes: any;
  @Input('dataCamEdit') dataCamEdit: any;
  @Output() afterSaveCom: EventEmitter<any> = new EventEmitter();
  @Output() afterEditCom: EventEmitter<any> = new EventEmitter();
  @Output() cancel: EventEmitter<any> = new EventEmitter();

  submitted: boolean = false;

  constructor(
    public administratorService: administratorService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService
  ) {}

  DataCompanyForm = new UntypedFormGroup({
    companyId: new UntypedFormControl(0),
    CompanyName: new UntypedFormControl('', [Validators.required]),
    CountryId: new UntypedFormControl('', [Validators.required]),
    City: new UntypedFormControl('', [Validators.required]),
    Email: new UntypedFormControl('', [Validators.required, Validators.email]),
    FirstName: new UntypedFormControl('', [Validators.required]),
    LastName: new UntypedFormControl('', [Validators.required]),
    PhoneNumber: new UntypedFormControl(''),
  });

  ngOnChanges(changes: SimpleChanges): void {
    this.DataCompanyForm.patchValue(this.dataCamEdit);

    // this.cdr.detectChanges();
  }

  ngOnInit(): void {}

  AddCompanyData() {
    if (this.DataCompanyForm.invalid) {
      this.toastr.error(document.dir=='rtl'?'يرجى ادخال الحقول المطلوبة':'Enter All Field Required');
    } else {
      if (this.dataCamEdit) {
        const body = {
          ...this.DataCompanyForm.value,
          companyId: this.dataCamEdit.CompanyId,
        };

        this.administratorService
          .addCompanies(body)
          .subscribe((resSave: any) => {
            if (resSave.rv > 0) {
              this.toastr.success(resSave.Msg);
              this.afterEditCom.emit(this.DataCompanyForm.value);
            } else {
              this.toastr.error(resSave.Msg);
            }
          });
        this.cdr.detectChanges();
      } else {
        const body = {
          ...this.DataCompanyForm.value,
        };

        this.administratorService
          .addCompanies(body)
          .subscribe((resSave: any) => {
            if (resSave.rv > 0) {
              this.toastr.success(resSave.Msg);
              this.DataCompanyForm.get('companyId')?.setValue(resSave.rv);
              this.afterSaveCom.emit(resSave.rv);
            } else {
              this.toastr.error(resSave.Msg);
            }
          });
        this.cdr.detectChanges();
      }
    }
  }
  onCancel() {
    this.cancel.emit();
  }
}
