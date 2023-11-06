import { AuthService } from './../../../modules/auth/services/auth.service';
import { Subscription } from 'rxjs/internal/Subscription';

import { ToastrService } from 'ngx-toastr';
import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CompaniesTeamsService } from './CompaniesTeams.service';
@Component({
  selector: 'Companies-Teams',
  templateUrl: './CompaniesTeams.component.html',
  styleUrls: ['./CompaniesTeams.component.scss'],
  providers: [MessageService],
})
export class CompaniesTeamsComponent implements OnInit, OnDestroy {
  dataMenuMember: any[];
  PagePermissions: any;
  CompaniesTeams: any[]=[];
  DataById: any;
  IDTeamSelected: any;
  TeamSelected: any;
  TeamName = new UntypedFormControl(null);
  IsEdit: boolean = true;
  loading: boolean = false;
  loadingPer: boolean = false;
  deleteTeamId: any;
  deleteTeamIdIndex: any;
  indexTeamEditName: number = 0;
  isEditName: boolean = false;
  interval: any;
  // @ViewChild('confirmdeleteRole', { static: true })
  // confirmdeleteRole: confirmDeleteComponent;
  @ViewChild('teamContainer') teamContainer: ElementRef;

  constructor(
    private service: CompaniesTeamsService,
    private auth: AuthService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {}
  searchedKeyword: string;
  subscription: Subscription;
  ngOnInit() {
    this.getMember();
    this.getDataCompaniesTeams();
    this.TeamName.valueChanges.subscribe((Name: string) => {
      this.CompaniesTeams[this.indexTeamEditName].TeamName = Name;
      this.isEditName = true;
    });
    this.subscription = this.auth.getonTimer().subscribe((value: any) => {
      if (this.interval) {
        clearInterval(this.interval);
      }

      let TimerRefresh = localStorage.getItem('TimerRefresh');

      if (TimerRefresh != '0' && TimerRefresh != 'now' && TimerRefresh) {
        this.interval = setInterval(() => {
          this.getDataCompaniesTeams();
        }, +TimerRefresh);
      } else if (value == 'now') {
        this.getDataCompaniesTeams();
      }
    });
  }

  getMember() {
    this.service.getMember().subscribe((data) => {
      this.dataMenuMember = data.LocationUsers;
      this.PagePermissions = data.PagePermissions;
      if (!this.PagePermissions?.TeamsEdit) {
        this.TeamName.disable();
      }
      this.cdr.detectChanges();
    });
  }
  getDataCompaniesTeams(checkedRole?: boolean) {
    this.loading = true;
    this.loadingPer = true;

    this.service.getDataCompaniesTeams().subscribe((data) => {
      this.CompaniesTeams = data;
      this.loading = false;
      this.loadingPer = false;
      if (!checkedRole && this.CompaniesTeams.length > 0) {
        this.indexTeamEditName = 0;
        this.GetDataById(
          this.CompaniesTeams[0].ID,
          this.CompaniesTeams[0].TeamName
        );
        this.CompaniesTeams[0].checked = true;
        this.TeamSelected = this.CompaniesTeams[0];
      } else {
        if (this.CompaniesTeams.length > 0) {
          this.indexTeamEditName = this.CompaniesTeams.length - 1;
          this.GetDataById(
            this.CompaniesTeams[this.CompaniesTeams.length - 1].ID,
            this.CompaniesTeams[this.CompaniesTeams.length - 1].TeamName
          );
          this.CompaniesTeams[this.CompaniesTeams.length - 1].checked = true;
          this.TeamSelected =
            this.CompaniesTeams[this.CompaniesTeams.length - 1];
        }
      }

      this.cdr.detectChanges();
      this.teamContainer.nativeElement.scrollTop =
        this.teamContainer.nativeElement.scrollHeight;
    });
  }

  onAddCompaniesTeams() {
    const body = {
      id: 0,
      locationId: localStorage.getItem('defaultLocation'),
      teamName: document.dir == 'rtl' ? 'فريق جديد' : 'New Team',
      userIDs: '',
    };
    this.service.addCompaniesTeams(body).subscribe(
      (res: any) => {
        if (res.rv > 0) {
          this.getDataCompaniesTeams(true);
        } else {
        }
      },
      (err) => {}
    );
  }

  deleteTeam() {
    this.service.deleteCompaniesTeams(this.deleteTeamId).subscribe(
      (res: any) => {
        if (res.rv > 0) {
          // this.getDataCompaniesTeams();
          this.CompaniesTeams.splice(this.deleteTeamIdIndex, 1);
          this.cdr.detectChanges();
          this.teamContainer.nativeElement.scrollTop = 0;
        } else {
        }
      },
      (err) => {}
    );
  }
  GetDataById(id: any, name: string) {
    this.loadingPer = true;
    this.CompaniesTeams.forEach((element: any) => {
      element.checked = false;
    });
    this.IsEdit = false;
    if (this.dataMenuMember) {
      this.dataMenuMember.forEach((item: any) => {
        item.checked = false;
      });
    }
    this.TeamName.setValue(name);
    this.isEditName = false;
    this.IDTeamSelected = id;
    this.service.GetDataById(id).subscribe((Data) => {
      this.DataById = Data;
      if (Data[0].Memebers) {
        Data[0].Memebers.forEach((value: any) => {
          this.dataMenuMember.forEach((element: any, index: any) => {
            if (element.Code == value.UserId) {
              element.checked = true;
            }
          });
        });
      }
      this.loadingPer = false;
      this.cdr.detectChanges();
    });
    this.IsEdit = true;
  }
  EditNameTeam() {
    if (this.isEditName == true) {
      if (this.TeamName.value?.trim() != '') {
        const body = {
          id: this.TeamSelected.ID,
          locationId: localStorage.getItem('defaultLocation'),
          teamName: this.TeamName.value,
          userIDs: this.TeamSelected.Memebers
            ? this.TeamSelected.Memebers.map((item: any) => {
                return item.UserId;
              }).join(',')
            : '',
        };
        this.service.addCompaniesTeams(body).subscribe(
          (res: any) => {
            // if (res.rv > 0) {
            // } else {
            //
            // }
          },
          (err) => {}
        );
      } else {
        this.toastr.error('Please enter team name');
      }
    }
    this.isEditName = false;
  }
  // readOnlyCheak(status: boolean) {
  //   if (status) {
  //     this.TeamName.disable();
  //   } else {
  //     this.TeamName.enable();

  //   }

  // }

  autoChecked(event: any, item: any) {
    // this.dataMenuMember.forEach((element: any) => {
    //   if (element.userId == item.userId) {
    //     element.checked = true;
    //   }

    // });

    if (event.target.checked == true) {
      const body = {
        teamId: this.IDTeamSelected,
        userId: item.Code,
      };
      this.service.addMemberforTeam(body).subscribe(
        (res: any) => {
          if (res.rv > 0) {
          } else {
          }
        },
        (err) => {}
      );
    } else {
      this.service
        .deleteMemberforTeam(this.IDTeamSelected, item.Code)
        .subscribe(
          (res: any) => {
            if (res.rv > 0) {
            } else {
            }
          },
          (err) => {}
        );
    }
  }
  CopyTeam(item: any) {
    const body = {
      id: 0,
      locationId: localStorage.getItem('defaultLocation'),
      teamName: item.TeamName,
      userIDs: item.Memebers
        ? item.Memebers.map((item: any) => {
            return item.UserId;
          }).join(',')
        : '',
    };
    this.service.addCompaniesTeams(body).subscribe(
      (res: any) => {
        if (res.rv > 0) {
          this.getDataCompaniesTeams(true);
        } else {
        }
      },
      (err) => {}
    );
  }
  // cheakAllPerCat(event: any, item: any) {
  //   if (event.target.checked) {
  //
  //     if (item.Permissions) {
  //       item.Permissions.forEach((element: any) => {
  //         if (!element.checked) {
  //           element.checked = true
  //           this.memberIdbyTeam.push(element.PermissionId)
  //         }
  //       });
  //       this.autoEditPer();
  //     }
  //   }

  // }
  // CheckAll() {
  //   this.dataMenuMember.forEach((element: any) => {
  //     element.checked = true;
  //   });

  // }
  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}
