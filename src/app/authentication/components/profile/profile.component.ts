import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AuthenService } from 'src/app/services/authen.service';
import { AccountService, InAccount, InRoleAccount } from 'src/app/shareds/services/account.service';
import { AlertService } from 'src/app/shareds/services/alert.service';
import { InProfileComponent } from './profile.interface';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements InProfileComponent {

  constructor(
    private modalService: BsModalService,
    private builder: FormBuilder,
    private alert: AlertService,
    private account: AccountService,
    private authen: AuthenService,
  ) {
    this.initialUserLogin();
    this.initialCreateFormData();
    this.initialLoadUpdateFormData();
  }
  form: FormGroup;
  userLogin: InAccount;
  modalRef: BsModalRef<any>;
  onSubmit() {
    if (this.form.invalid)
      return this.alert.some_err_humen();
    console.log('api to update Profile');
    try {
      this.account
        .onUpdateProfile(this.authen.getAuthenticated(), this.form.value)
        .then(() => {
          this.alert.notify(`อัปเดทโปรไฟล์สำเร็จ`, 'info');
        })
        .catch(err => {
          this.alert.notify(`${err.Message}`);
        });

    } catch (err) {
      this.alert.notify(`Profile component [function onSubmit] : ${err.Message}`);
    }


  }

  openModal(template: TemplateRef<any>) {
    try {
      this.modalRef = this.modalService.show(template);

    } catch (err) {
      this.alert.notify(`function openModal : ` + err.Message);
      console.log(`function openModal : ` + err.Message);
    }

  }

  private initialCreateFormData() {
    try {
      this.form = this.builder.group({
        username: ['', Validators.required],
        firstname: ['', Validators.required],
        lastname: ['', Validators.required],
        position: ['', Validators.required],
      })

    } catch (err) {
      this.alert.notify(`function initialCreateFormData : ` + err.Message);
      console.log(`function initialCreateFormData : ` + err.Message);
    }

  }

  private async initialLoadUpdateFormData() {
    try {
      const user = await this.account.getUserLogin(this.authen.getAuthenticated());
      console.log('****');
      console.log(user);
      this.form.controls['username'].setValue(user.username);
      this.form.controls['firstname'].setValue(user.firstname);
      this.form.controls['lastname'].setValue(user.lastname);
      this.form.controls['position'].setValue(user.position);
      console.log(this.form.value.username);
    } catch (err) {
      this.alert.notify('function initialLoadUpdateFormData : ' + err.Message);
      console.log(`function initialLoadUpdateFormData : ` + err.Message);
    }
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

  async initialUserLogin() {
    this.userLogin = await this.account.getUserLogin(this.authen.getAuthenticated());
  }

}
