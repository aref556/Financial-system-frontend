import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppURL } from 'src/app/app.url';
import { AuthURL } from 'src/app/authentication/authentication.url';
import { AuthenService } from 'src/app/services/authen.service';
import { AccountService, InAccount, InRoleAccount } from '../../services/account.service';
import { AlertService } from '../../services/alert.service';
import { InAuthSidebarComponent } from './auth-sidebar.interface';
declare const App;
@Component({
  selector: 'app-auth-sidebar',
  templateUrl: './auth-sidebar.component.html',
  styleUrls: ['./auth-sidebar.component.css']
})
export class AuthSidebarComponent implements OnInit, InAuthSidebarComponent {

  constructor(
    private account: AccountService,
    private authen: AuthenService,
    private alert: AlertService,
    private router: Router,
  ) {
    this.initialLoadUserLogin();
  }


  ngOnInit(): void {
    // App.initialLoadPage();
  }

  AppURL = AppURL;
  AuthURL = AuthURL;
  UserLogin: InAccount;
  Role = InRoleAccount;

  // โหลดข้อมูล User ที่เข้าสู่ระบบ จาก Token
  private initialLoadUserLogin() {
    this.UserLogin = this.account.userLogin;
    if (this.UserLogin.id) return setTimeout(() => App.initialLoadPage(), 100);

    this.account
      .getUserLogin(this.authen.getAuthenticated())
      .then(userLogin => {
        this.UserLogin = userLogin;
        // โหลดข้อมูล script สำหรับ sidebar
        setTimeout(() => App.initialLoadPage(), 100);
      })
      .catch(err => {
        this.alert.notify(err.Message);
        this.authen.clearAuthenticated();
        this.router.navigate(['/', AppURL.Login]);
      });
  }

  getRoleName(role: InRoleAccount) {
    try {
      if (InRoleAccount[role] == InRoleAccount[1])
        return 'บัญชีผู้ใช้';
      else if (InRoleAccount[role] == InRoleAccount[2])
        return 'บัญชีผู้ดูแล';
      else
        return InRoleAccount[role];
    } catch (err) {
      this.alert.notify('function getRoleName : ' + err.Message);
      console.log(`function getRoleName : ` + err.Message);
    }
  }
}
