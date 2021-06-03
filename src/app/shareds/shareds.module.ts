import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PaginationModule } from 'ngx-bootstrap/pagination'
import { AuthNavbarComponent } from './components/auth-navbar/auth-navbar.component';
import { AuthSidebarComponent } from './components/auth-sidebar/auth-sidebar.component';
import { AuthContentComponent } from './components/auth-content/auth-content.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertService } from './services/alert.service';
import { AccountService } from './services/account.service';
import { PdfService } from './services/pdf.service';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

// เพิ่มภาษาไทยให้กับ Datepicker
import { defineLocale } from 'ngx-bootstrap/chronos';
import { thLocale } from 'ngx-bootstrap/locale';
defineLocale('th', thLocale);



@NgModule({
  declarations: [
    AuthNavbarComponent,
    AuthSidebarComponent,
    AuthContentComponent,
  ],
  imports: [
    CommonModule,
    BsDropdownModule.forRoot(),
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    PaginationModule.forRoot(),
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
  ],
  exports: [
    AuthNavbarComponent,
    AuthSidebarComponent,
    AuthContentComponent,
    BsDropdownModule,
    FormsModule,
    ReactiveFormsModule,
    PaginationModule,
    ModalModule,
    BsDatepickerModule,
  ],
  providers: [
    AlertService,
    AccountService,
    PdfService,
  ]
})
export class SharedsModule { }
