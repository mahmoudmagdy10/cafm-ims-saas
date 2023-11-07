import { MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { ConfigurationService } from './../../../../pages/settings/configurations/configurations.service';
import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  HostListener,
  ViewChild,
  ElementRef,
} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { TwoWayFactoryComponent } from '../two-way-factory/two-way-factory.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  // @HostListener('document:keydown.enter', ['$event'])
  // onEnter(event: KeyboardEvent) {
  //   console.log('this.disableLogin', this.disableLogin);

  //   event.preventDefault();
  //   this.login();
  //   // Perform action
  // }
  //   @HostListener('document:keydown.enter', ['$event']) onKeydownHandler(event: KeyboardEvent) {
  //     console.log(event);
  // }
  // KeenThemes mock, change it to:
  @ViewChild('email') email!: ElementRef;
  defaultAuth: any = {
    email: '',
    password: '',
  };
  loginForm: UntypedFormGroup;
  hasError: boolean;
  returnUrl: string;
  isLoading$: Observable<boolean>;
  disableLogin: boolean = true;
  DEBUG = environment.DEBUG;
  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private fb: UntypedFormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private _configurationService: ConfigurationService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    public dialog: MatDialog
  ) {
    this.isLoading$ = this.authService.isLoading$;
    // redirect to home if already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.initForm();
    // get return url from route parameters or default to '/'
    this.returnUrl =
      this.route.snapshot.queryParams['returnUrl'.toString()] || '/';
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }
  initForm() {
    this.loginForm = this.fb.group({
      email: [
        this.defaultAuth.email,
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.minLength(3),
          Validators.maxLength(320), // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
        ]),
      ],
      password: [
        this.defaultAuth.password,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ]),
      ],
    });
  }

  login() {
    if (this.loginForm.valid && (!this.disableLogin || this.DEBUG)) {
    // if (this.loginForm.valid) {
      this.authService
        .login('/token', this.f.email.value, this.f.password.value)
        .subscribe(
          (res: any) => {
          },
          (err: any) => {
            if (err?.rv == '-1078') {
              this.confirmLogin();
            }
          }
        );
    }
  }
  async getConfiguration() {
    await this._configurationService.getLocation();
    return await this._configurationService.getConfiguration();
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
  showResponse(Response: any) {
    this.disableLogin = false;
    console.log(document.getElementById('email'));
    setTimeout(() => {
      document.getElementById('email')?.focus();
      this.cdr.detectChanges();
    }, 500);
  }
  confirmLogin() {
    this.disableLogin = true;
    console.log('confirmLogin');
    const dialogRef = this.dialog
      .open(TwoWayFactoryComponent, {
        width: '30vw',
        data: {
          email: this.f.email.value,
        },
        disableClose: true,
      })
      .addPanelClass('cmms-custom-modal');
    dialogRef.afterClosed().subscribe((result) => {
      this.disableLogin = false;
    });
  }
}
