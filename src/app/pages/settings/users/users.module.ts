import { BadgeModule } from 'primeng/badge';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../../shared/Shared.module';
import { DropdownModule } from 'primeng/dropdown';
import { DropdownMenusModule } from './../../../_metronic/partials/content/dropdown-menus/dropdown-menus.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { modal1Component } from './Dailogs/modal1/modal1.component';
import { modal2Component } from './Dailogs/modal2/modal2.component';
import { modal3Component } from './Dailogs/modal3/modal3.component';
import { modal4Component } from './Dailogs/modal4/modal4.component';
import { modal5Component } from './Dailogs/modal5/modal5.component';
import { InlineSVGModule } from 'ng-inline-svg';
import { PrimeModule } from './../prime.module';
import { TooltipModule } from 'primeng/tooltip';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { usersComponent } from './users.component';
import { DialogModule } from 'primeng/dialog';
import { AddUserComponent } from './Dailogs/modalAddUser/modalAddUser.component';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ButtonModule } from 'primeng/button';
import { MessagesModule } from 'primeng/messages';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CommonModule } from '@angular/common';
import { ImageCropperModule } from 'ngx-image-cropper';
import { MatExpansionModule } from '@angular/material/expansion';
import {
  MatProgressSpinnerModule,
  MatSpinner,
} from '@angular/material/progress-spinner';
import { ConfirmationService } from 'primeng/api';
import { MatDialogModule } from '@angular/material/dialog';
import { FilterUserComponent } from './Dailogs/FilterModule/FilterModule.component';
import { SendEmailUser } from './Dailogs/SendEmailModule/SendEmailModule.component';
import { PasswordModule } from 'primeng/password';
import { EditorModule } from 'primeng/editor';
import { UserLogsComponent } from './user-logs/user-logs.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { PaginationComponentModule } from 'src/app/shared/components/pagination-component/pagination-component.module';
import { FilterLogsComponent } from './user-logs/filter-logs/filter-logs.component';
import { DashboardUsersComponent } from './Dailogs/dashboard-users/dashboard-users.component';
import { CheckboxModule } from 'primeng/checkbox';

@NgModule({
  declarations: [
    usersComponent,
    AddUserComponent,
    modal1Component,
    modal2Component,
    modal3Component,
    modal4Component,
    modal5Component,
    FilterUserComponent,
    SendEmailUser,
    UserLogsComponent,
    FilterLogsComponent,
    DashboardUsersComponent,
  ],
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: usersComponent,
      },
      {
        path: 'userLog/:userId',
        component: UserLogsComponent,
      },
    ]),
    MatDialogModule,
    TooltipModule,
    InlineSVGModule,
    TooltipModule,
    DialogModule,
    PrimeModule,
    SplitButtonModule,
    ConfirmDialogModule,
    ButtonModule,
    MessagesModule,
    MatTableModule,
    MatPaginatorModule,
    NgbDropdownModule,
    ReactiveFormsModule,
    CommonModule,
    ImageCropperModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    DropdownMenusModule,
    DropdownModule,
    SharedModule,
    MatProgressSpinnerModule,
    EditorModule,
    TranslateModule.forChild(),
    PasswordModule,
    ProgressSpinnerModule,
    PaginationComponentModule,
    BadgeModule,
    CheckboxModule,
    FormsModule,
  ],
  providers: [ConfirmationService],
})
export class usersModule {}
