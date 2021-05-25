import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FinancialDocumentService } from 'src/app/authentication/services/financial-document.service';
import { UserService } from 'src/app/authentication/services/user.services';
import { AlertService } from 'src/app/shareds/services/alert.service';
import { PdfService } from 'src/app/shareds/services/pdf.service';
import { InInvoiceDocument } from '../invoice-document/invoice-document.interface';
import { ForwarderSelect } from '../invoice/invoice.interface';
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
