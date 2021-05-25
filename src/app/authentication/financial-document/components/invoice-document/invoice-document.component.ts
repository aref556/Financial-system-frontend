import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FinancialDocumentService } from 'src/app/authentication/services/financial-document.service';
import { UserService } from 'src/app/authentication/services/user.services';
import { AccountService } from 'src/app/shareds/services/account.service';
import { AlertService } from 'src/app/shareds/services/alert.service';
import { PdfService } from 'src/app/shareds/services/pdf.service';
import { ForwarderSelect } from '../invoice/invoice.interface';
import { InInvoiceDocument, InInvoiceDocumentComponent } from './invoice-document.interface';

@Component({
  selector: 'app-invoice-document',
  templateUrl: './invoice-document.component.html',
  styleUrls: ['./invoice-document.component.css']
})
export class InvoiceDocumentComponent implements InInvoiceDocumentComponent {

  constructor(
    private pdf: PdfService,
    private alert: AlertService,
    private router: Router,
    private account: AccountService,
    private builder: FormBuilder,
    private service: FinancialDocumentService,
  ) {
    this.initialCreateFormData();
    // this.pdf.generateTesting();
  }

  form: FormGroup;
  doc: InInvoiceDocument;
  forwarder_select: ForwarderSelect = { id: 2, name: 'นางเนาวรัตน์ สอิด', job_position: 'หัวหน้าฝ่ายบริหารจัดการ สำนักนวัตกรรมดิจิตอลและระบบอัจฉริยะ'};
  forwarders: ForwarderSelect[] = [
    { id: 0, name: 'รศ.ดร. สินชัย กมลภิวงศ์', job_position: 'รักษาการแทนผู้อำนวยการ สำนักนวัตกรรมดิจิตอลและระบบอัจฉริยะ' },
    { id: 1, name: 'ดร. ชิดชนก โชคสุชาติ' , job_position: 'รักษาการแทนรองผู้อำนวยการ สำนักนวัตกรรมดิจิตอลและระบบอัจฉริยะ'},
    { id: 2, name: 'นางเนาวรัตน์ สอิด', job_position: 'หัวหน้าฝ่ายบริหารจัดการ สำนักนวัตกรรมดิจิตอลและระบบอัจฉริยะ' },
  ];

  onSubmit() {
    if (this.form.invalid) return this.alert.some_err_humen();
    this.doc = this.form.value;
    this.doc.type = 2;
    this.doc.guarantor = this.forwarder_select.name;
    this.doc.guarantor_position = this.forwarder_select.job_position;
    // console.log(this.doc);
    this.pdf.generateInvoiceDocs(this.doc);
    this.service.onCreateInvoiceDocument(this.doc);
    // this.account
    //   .onCreateFinancialDocument(this.form.value)
    //   .then(res => {
    //     this.alert.notify('สร้างฟอร์มสำเร็จ', 'Info');
    //   })
    //   .catch(err => this.alert.notify(err.Message));
  }


  // สร้างฟอร์ม
  private initialCreateFormData() {
    this.form = this.builder.group({
      id_doc: ['', Validators.required],
      date: ['', Validators.required],
      title: ['', Validators.required],
      title_to: ['', Validators.required],
      address: [''],
      message: ['', Validators.required],
      // ตัวแปรเผื่อ
      type: [''],
      address_option: [''],
      message_start: [''],
      id_tax: [''],
      message_end: [''],
      manager_name: [''],
      manager_position: [''],

    });
  }

}
