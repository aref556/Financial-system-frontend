import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FinancialDocumentService } from 'src/app/authentication/services/financial-document.service';
import { UserService } from 'src/app/authentication/services/user.services';
import { AccountService } from 'src/app/shareds/services/account.service';
import { AlertService } from 'src/app/shareds/services/alert.service';
import { PdfService } from 'src/app/shareds/services/pdf.service';
import { ForwarderSelect, InInvoice, InInvoiceComponent, TypeIncome } from './invoice.interface';

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
  type_income_select: TypeIncome = { id: 0, type: 'ไม่เลือกประเภทของรายได้' };
  type_income: TypeIncome[] = [
    { id: 1, type: 'เงินรายได้เงินผลประโยชน์ หัก 5%' },
    { id: 2, type: 'เงินบริการวิชาการ พ.ศ. 2551' },
    { id: 3, type: 'เงินรับฝาก' },
    { id: 4, type: 'เงินรับฝากระยะยาว' },
    // { id: 5, type: 'ค่าเช่า Core Fiber ' },
    // { id: 6, type: 'ค่าเช่าคู่สายทองแดง' },
    // { id: 7, type: 'PSU Passport' },
    // { id: 8, type: 'ค่าบำรุงรักษาโทรศัพท์' },
    // { id: 9, type: 'ค่าจัดสอบวัดความรู้ทางคอมพิวเตอร์' },
    // { id: 10, type: 'รายได้อื่นๆ' },
    // { id: 11, type: 'ค่าพิมพ์สี' },
    // { id: 12, type: 'ค่าพิมพ์วุฒิบัตร' },
    // { id: 13, type: 'ค่าเช่าเครื่องคอมพิวเตอร์แม่ข่าย' },
    // { id: 14, type: 'ค่าเช่าอุปกรณ์รับส่งสัญญาณอินเตอร์เน็ต' },
    // { id: 15, type: 'ค่าซอฟต์แวร์ลิขสิทธิ์งานโทรศัพท์' },
    // { id: 16, type: 'รายได้ค่าแท่นติดตั้งอุปกรณ์' }

  ];
  forwarder_select: ForwarderSelect = { id: 2, name: 'นางเนาวรัตน์ สอิด', job_position: 'หัวหน้าฝ่ายบริหารจัดการ สำนักนวัตกรรมดิจิตอลและระบบอัจฉริยะ' };
  forwarders: ForwarderSelect[] = [
    { id: 0, name: 'รศ.ดร. สินชัย กมลภิวงศ์', job_position: 'รักษาการแทนผู้อำนวยการ สำนักนวัตกรรมดิจิตอลและระบบอัจฉริยะ' },
    { id: 1, name: 'ดร. ชิดชนก โชคสุชาติ', job_position: 'รักษาการแทนรองผู้อำนวยการ สำนักนวัตกรรมดิจิตอลและระบบอัจฉริยะ' },
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
    this.doc.type_income = this.type_income_select.type;
    if (this.doc.product_detail_2 != '' || this.doc.product_number_2 != null || this.doc.product_prize_2 != null) {
      if (this.doc.product_detail_2 != '' && this.doc.product_number_2 != null && this.doc.product_prize_2 != null) {
        this.pdf.generateInvoice(this.doc);
        this.service.onCreateInvoice(this.doc);
      }
      else {
        this.alert.notify('กรุณากรอกข้อมูลของสินค้า 2 ให้ครบ');
      }
    }
    else {
      this.pdf.generateInvoice(this.doc);
      this.service.onCreateInvoice(this.doc);
    }
  }

  onSelectType(select: TypeIncome): void {
    this.type_income_select = select;
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
