import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppURL } from 'src/app/app.url';
import { AuthenService } from 'src/app/services/authen.service';
import { AccountService } from 'src/app/shareds/services/account.service';
import { AlertService } from 'src/app/shareds/services/alert.service';
import { InLoginComponent } from './login.interface';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements InLoginComponent {

  constructor(
    // private builder: FormBuilder
    private builder: FormBuilder,
    private alert: AlertService,
    private account: AccountService,
    private authen: AuthenService,
    private router: Router,
    private activateRoute: ActivatedRoute,
  ) {

    //เก็บต่า returURL เพื่อ redirect หลังจากเข้าสู่ระบบ
    this.activateRoute.params.forEach(params => {
      this.returnURL = params.returnURL || `/${AppURL.Authen}`;
    })
    this.initialCreateFormData();
    // this.alert.notify('ควยยย', 'danger');
  }

  Url = AppURL;
  returnURL: string;
  form: FormGroup;

  // เข้าสู่ระบบ
  onSubmit(): void {
    if (this.form.invalid)
      return this.alert.some_err_humen();
    this.account
      .onLogin(this.form.value)
      .then(res => {
        // console.log(res);
        //เก็บ accessToke ใน LocalStorage
        this.authen.setAuthenticated(res.accessToken);
        // แจ้งเตือน และ redirect หน้า page
        this.alert.notify('การเข้าสู่ระบบสำเร็จ', 'info');
        this.router.navigateByUrl(this.returnURL);
      })
      .catch(err => this.alert.notify(err.Message));

  }

  // สร้างฟอร์ม

  private initialCreateFormData() {
    this.form = this.builder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
}

