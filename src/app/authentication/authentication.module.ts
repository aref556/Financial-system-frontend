import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './components/profile/profile.component';
import { AuthenticationRouting } from './authentication.routing';
import { FinancialListComponent } from './components/financial-list/financial-list.component';

import { FinancialDocumentModule } from './financial-document/financial-document.module';
import { ManageAdminsModule } from './manage-admins/manage-admins.module';
import { ManageUsersModule } from './manage-users/manage-users.module';
import { SharedsModule } from '../shareds/shareds.module';
import { UserService } from './services/user.services';
import { FinancialDocumentService } from './services/financial-document.service';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalChangePasswordComponent } from './components/profile/modal-change-password/modal-change-password.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SuccessProcessComponent } from './components/financial-list/success-process/success-process.component';


@NgModule({
  declarations: [
    ProfileComponent,
    FinancialListComponent,
    ModalChangePasswordComponent,
    SuccessProcessComponent,
  ],
  imports: [
    CommonModule,
    AuthenticationRouting,
    SharedsModule,
    FinancialDocumentModule,
    ManageAdminsModule,
    ManageUsersModule,
    PaginationModule.forRoot(),
  ],
  providers: [
    UserService,
    FinancialDocumentService,
  ]
})
export class AuthenticationModule { }
