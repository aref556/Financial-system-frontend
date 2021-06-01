import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AuthenService } from 'src/app/services/authen.service';
import { AccountService } from 'src/app/shareds/services/account.service';
import { AlertService } from 'src/app/shareds/services/alert.service';
import { InModalChangePasswordComponent } from './modal-change-password.interface';

@Component({
  selector: 'app-modal-change-password',
  templateUrl: './modal-change-password.component.html',
  styleUrls: ['./modal-change-password.component.css']
})
export class ModalChangePasswordComponent implements InModalChangePasswordComponent {

  constructor(
    private builder: FormBuilder,
    private alert: AlertService,
    private account: AccountService,
    private auth: AuthenService,
  ) {
    this.initialCreateFormData();
  }
  @Input('modalRef') modalRef: BsModalRef<any>;
  form: FormGroup;

  onSubmit() {
    if (this.form.invalid)
      return this.alert.some_err_humen();
    console.log('request api reset password');
    this.account.onUpdatePassword(this.auth.getAuthenticated(), this.form.value)
      .then(status => {
        console.log(status);
        this.modalRef.hide();
        this.alert.notify(`เปลี่ยนรหัสผ่านสำเร็จ`)
      })
      .catch(err => this.alert.notify(err.Message));
  }

  private initialCreateFormData() {
    this.form = this.builder.group({
      origin_pass: ['', Validators.required],
      new_pass: ['', Validators.required],
      cnew_pass: ['', Validators.required],
    })
  }

  // private toggleShow() {
  //   this.showPassword = !this.showPassword;
  //   this.input.type = this.showPassword ? 'text' : 'password';
  // }
}

