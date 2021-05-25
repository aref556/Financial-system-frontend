import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FinancialDocumentService } from 'src/app/authentication/services/financial-document.service';
import { UserService } from 'src/app/authentication/services/user.services';
import { AccountService } from 'src/app/shareds/services/account.service';
import { AlertService } from 'src/app/shareds/services/alert.service';
import { PdfService } from 'src/app/shareds/services/pdf.service';
import { ForwarderSelect, InInvoice, InInvoiceComponent } from './invoice.interface';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements InInvoiceComponent {

  constructor(
    private pdf: PdfService,
    private alert: AlertService,
    private builder: FormBuilder,
    private service: FinancialDocumentService,
  ) {
    this.initialCreateFormData();
    // console.log(this.forwarderSelect[0]);
    // this.pdf.generateTesting();
  }
  forwarder_select: ForwarderSelect = { id: 2, name: 'นางเนาวรัตน์ สอิด', job_position: 'หัวหน้าฝ่ายบริหารจัดการ สำนักนวัตกรรมดิจิตอลและระบบอัจฉริยะ'};
  forwarders: ForwarderSelect[] = [
    { id: 0, name: 'รศ.ดร. สินชัย กมลภิวงศ์', job_position: 'รักษาการแทนผู้อำนวยการ สำนักนวัตกรรมดิจิตอลและระบบอัจฉริยะ' },
    { id: 1, name: 'ดร. ชิดชนก โชคสุชาติ' , job_position: 'รักษาการแทนรองผู้อำนวยการ สำนักนวัตกรรมดิจิตอลและระบบอัจฉริยะ'},
    { id: 2, name: 'นางเนาวรัตน์ สอิด', job_position: 'หัวหน้าฝ่ายบริหารจัดการ สำนักนวัตกรรมดิจิตอลและระบบอัจฉริยะ' },
  ];

  form: FormGroup;
  doc: InInvoice;

  onSubmit() {
    if (this.form.invalid) this.alert.some_err_humen();
    this.doc = this.form.value;
    this.doc.type = 1;
    this.doc.forwarder = this.forwarder_select.name;
    this.doc.forwarder_position = this.forwarder_select.job_position;
    this.pdf.generateInvoice(this.doc);
    this.service.onCreateInvoice(this.doc);
  }

  // สร้างฟอร์ม
  private initialCreateFormData() {
    this.form = this.builder.group({
      address: ['', Validators.required],
      payment_due: ['', Validators.required],
      guarantee: ['', Validators.required],
      product_detail_1: ['', Validators.required],
      product_detail_2: [''],
      product_number_1: [null, Validators.required],
      product_number_2: [null],
      product_prize_1: ['', Validators.required],
      product_prize_2: [null],
      date: ['', Validators.required],
    });
  }



}
