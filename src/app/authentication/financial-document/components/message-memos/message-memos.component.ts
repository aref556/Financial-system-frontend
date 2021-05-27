import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FinancialDocumentService } from 'src/app/authentication/services/financial-document.service';
import { UserService } from 'src/app/authentication/services/user.services';
import { AlertService } from 'src/app/shareds/services/alert.service';
import { PdfService } from 'src/app/shareds/services/pdf.service';
import { InInvoiceDocument } from '../invoice-document/invoice-document.interface';
import { ForwarderSelect, TypeIncome } from '../invoice/invoice.interface';
import { InMessageMemosComponent } from './message-memos.interface';

@Component({
  selector: 'app-message-memos',
  templateUrl: './message-memos.component.html',
  styleUrls: ['./message-memos.component.css']
})
export class MessageMemosComponent implements InMessageMemosComponent {

  constructor(
    private pdf: PdfService,
    private alert: AlertService,
    private builder: FormBuilder,
    private service: FinancialDocumentService,
  ) {
    this.initialCreateFormData();
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

  onSelectType(select: TypeIncome): void {
    this.type_income_select = select;
  }

  form: FormGroup;
  doc: InInvoiceDocument;
  forwarder_select: ForwarderSelect = { id: 2, name: 'นางเนาวรัตน์ สอิด', job_position: 'หัวหน้าฝ่ายบริหารจัดการ สำนักนวัตกรรมดิจิตอลและระบบอัจฉริยะ' };
  forwarders: ForwarderSelect[] = [
    { id: 0, name: 'รศ.ดร. สินชัย กมลภิวงศ์', job_position: 'รักษาการแทนผู้อำนวยการ สำนักนวัตกรรมดิจิตอลและระบบอัจฉริยะ' },
    { id: 1, name: 'ดร. ชิดชนก โชคสุชาติ', job_position: 'รักษาการแทนรองผู้อำนวยการ สำนักนวัตกรรมดิจิตอลและระบบอัจฉริยะ' },
    { id: 2, name: 'นางเนาวรัตน์ สอิด', job_position: 'หัวหน้าฝ่ายบริหารจัดการ สำนักนวัตกรรมดิจิตอลและระบบอัจฉริยะ' },
  ];

  onSubmit(): void {
    if (this.form.invalid) return this.alert.some_err_humen();
    this.doc = this.form.value;
    this.doc.type = 4;
    this.doc.guarantor = this.forwarder_select.name;
    this.doc.guarantor_position = this.forwarder_select.job_position;
    this.doc.type_income = this.type_income_select.type;
    // console.log(this.doc);
    this.pdf.generateMessageMemos(this.doc);
    this.service.onCreateMessageMemos(this.doc);
  }

  // สร้างฟอร์ม
  private initialCreateFormData() {
    this.form = this.builder.group({
      id_doc: ['', Validators.required],
      date: ['', Validators.required],
      title: ['', Validators.required],
      title_to: ['', Validators.required],
      message: ['', Validators.required],
    });
  }



}
