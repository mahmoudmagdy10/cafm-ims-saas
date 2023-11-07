import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import {
  Component,
  HostBinding,
  OnDestroy,
  OnInit,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { TranslationService } from '../../../../../../modules/i18n';
import { AuthService, UserType } from '../../../../../../modules/auth';
import { UserInnerService } from './user-inner.service';

@Component({
  selector: 'app-user-inner',
  templateUrl: './user-inner.component.html',
})
export class UserInnerComponent implements OnInit, OnDestroy {
  @HostBinding('class')
  class = `menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-275px`;
  @HostBinding('attr.data-kt-menu')
  dataKtMenu = 'true';
  @Output() openModalChangePass: EventEmitter<any> = new EventEmitter();
  language: LanguageFlag;
  user$: Observable<UserType>;
  langs = languages;
  firstname: any;
  lastname: any;
  email: any;
  pic: any;
  @Input() imageProfile: any;
  private unsubscribe: Subscription[] = [];
  active: any;
  constructor(
    public auth: AuthService,
    private translationService: TranslationService,
    private router: Router,
    private service: UserInnerService,
    private toastr: ToastrService
  ) {}
  isSuper: any;
  Avatar = environment.Avatar;

  ngOnInit(): void {
    this.user$ = this.auth.currentUserSubject.asObservable();

    this.setLanguage(this.translationService.getSelectedLanguage());
    this.firstname = localStorage.getItem('fullName');
    this.isSuper = localStorage.getItem('isSuperUser');

    this.pic = '';
    this.dataKtMenu = 'true';
  }

  Email() {
    let email = localStorage.getItem('email');
    if (email) {
      return email;
    }
  }
  logout() {
    document.location.reload();
    this.auth.logout();
  }

  selectLanguage(lang: string) {
    if (lang != this.language.lang) {
      this.service.convertLanguage(lang).subscribe(
        (res: any) => {
          if (res.rv > 0) {
            this.translationService.setLanguage(res.Data.languageCode);
            localStorage.setItem('token', res.Data.token);
            document.location.reload();
          } else {

          }
        },
        (err) => {

        }
      );
    }
  }

  setLanguage(lang: string) {

    this.langs.forEach((language: LanguageFlag) => {
      if (language.lang === lang) {
        language.active = true;
        this.language = language;
      } else {
        language.active = false;
      }
    });
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
  profile() {
    this.router.navigate(['settings/my-profile']);
  }
}

interface LanguageFlag {
  lang: string;
  name: string;
  flag: string;
  active?: boolean;
}

const languages = [
  {
    lang: 'en',
    name: 'English',
    flag: './assets/media/flags/united-states.svg',
  },
  {
    lang: 'ar',
    name: 'Arabic',
    flag: './assets/media/flags/flag-saudi-arabia.svg',
  },
  // {
  //   lang: 'es',
  //   name: 'Spanish',
  //   flag: './assets/media/flags/spain.svg',
  // },
  // {
  //   lang: 'ja',
  //   name: 'Japanese',
  //   flag: './assets/media/flags/japan.svg',
  // },
  // {
  //   lang: 'de',
  //   name: 'German',
  //   flag: './assets/media/flags/germany.svg',
  // },
  // {
  //   lang: 'fr',
  //   name: 'French',
  //   flag: './assets/media/flags/france.svg',
  // },
];
