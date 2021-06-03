import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FinancialDocumentService } from 'src/app/authentication/services/financial-document.service';
import { AuthenService } from 'src/app/services/authen.service';
import { AccountService } from 'src/app/shareds/services/account.service';
import { AlertService } from 'src/app/shareds/services/alert.service';
import { InDocumentSearch } from '../financial-list.interface';
import { InSuccessProcessComponent } from './success-process.interface';

@Component({
  selector: 'app-success-process',
  templateUrl: './success-process.component.html',
  styleUrls: ['./success-process.component.css']
})
export class SuccessProcessComponent implements InSuccessProcessComponent {

  constructor(
    private builder: FormBuilder,
    private alert: AlertService,
    private account: AccountService,
    private auth: AuthenService,
    private document: FinancialDocumentService,
  ) {
    this.initialCreateFormData();
  }
  @Input('modalRef') modalRef: BsModalRef<any>;
  form: FormGroup;

  onSubmit() {
    if (this.form.invalid)
      return this.alert.some_err_humen();
    console.log(this.form.value);
    console.log(`api to accept documents`);
    
    this.document.updateFlagStatus(this.auth.getAuthenticated(), this.form.value)
      .then(status => {
        console.log(status);
        this.modalRef.hide();
        this.alert.notify(`เปลี่ยนรหัสผ่านสำเร็จ`, 'info')
      })
      .catch(err => {
        this.alert.notify(err.Message);
      })


  }

  private initialCreateFormData() {
    this.form = this.builder.group({
      success_time: ['', Validators.required],
      success_id_doc: ['', Validators.required],
      note: ['', Validators.required],
    })
  }

  // โหลดข้อมูลเอกสาร
  private initialLoadDocuments(options?: InDocumentSearch) {
    this.document
      .getDocuments(options)
      .then(items => {
        this.items = items;
        // console.log(this.items);
      })
      .catch(err => this.alert.notify(`initialLoadDoc: ` + err.Message));
  }




}
