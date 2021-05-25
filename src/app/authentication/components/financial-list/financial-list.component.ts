import { ChangeDetectorRef, Component } from '@angular/core';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { InRoleDocument, InDocument, FinancialDocumentService } from 'src/app/authentication/services/financial-document.service';
import { AuthenService } from 'src/app/services/authen.service';
import { AccountService, InAccount, InRoleAccount } from 'src/app/shareds/services/account.service';
import { AlertService } from 'src/app/shareds/services/alert.service';
import { PdfService } from 'src/app/shareds/services/pdf.service';
import { InDelivery } from '../../financial-document/components/delivery/delivery.interface';
import { InInvoiceDocument } from '../../financial-document/components/invoice-document/invoice-document.interface';
import { InInvoice } from '../../financial-document/components/invoice/invoice.interface';
import { InMessageMemos } from '../../financial-document/components/message-memos/message-memos.interface';
import { InDocumentList, InDocumentSearch, InDocumentSearchKey, InFinancialListComponent } from './financial-list.interface';

@Component({
  selector: 'app-financial-list',
  templateUrl: './financial-list.component.html',
  styleUrls: ['./financial-list.component.css']
})
export class FinancialListComponent implements InFinancialListComponent {

  constructor(
    private document: FinancialDocumentService,
    private alert: AlertService,
    private detect: ChangeDetectorRef,
    private account: AccountService,
    private authen: AuthenService,
    private pdf: PdfService,


  ) {
    // เปลี่ยน Dateoicker เป็นภาษาไทย

    // โหลดข้อมูลเอกสาร
    this.initialLoadDocuments({
      startPage: this.startPage,
      limitPage: this.limitPage,
    });
    //กำหนดต่าเริ่มต้นให้กับ searchType
    this.searchType = this.searchTypeItems[0];
    // โหลด user login
    this.initialLoadUserLogin();


  }
  docInvoice: InInvoice;
  docInvoiceDocument: InInvoiceDocument;
  docMessageMemos: InMessageMemos;
  docDelivery: InDelivery;
  items: InDocumentList;
  // ตัวแปรสำหรับค้นหา
  searchText: string = '';
  searchType: InDocumentSearchKey;
  searchTypeItems: InDocumentSearchKey[] = [
    { key: 'type', value: 'ค้นหาจากประเภทของเอกสาร' },
    { key: 'id_doc', value: 'ค้นหาจากหมายเลขเอกสาร' },
    { key: 'updated', value: 'ค้นหาจากวันที่' },

  ];
  // ตัวแปร pagination
  startPage: number = 1;
  limitPage: number = 5;

  //ตรวจสอบสิทธ์ผู้ใช้งาน
  UserLogin: InAccount;
  Role: typeof InRoleAccount;

  //เปลี่ยนหน้า pagination
  onPageChanged(page: PageChangedEvent) {
    this.initialLoadDocuments({
      searchText: this.getSearchText,
      searchType: this.searchType.key,
      startPage: page.page,
      limitPage: page.itemsPerPage
    });
  }

  // ค้นหาข้อมูล
  onSearchItem(): void {
    this.startPage = 1;
    this.initialLoadDocuments({
      searchText: this.getSearchText,
      searchType: this.searchType.key,
      startPage: this.startPage,
      limitPage: this.limitPage
    });
    //กระตุ้น Event
    this.detect.detectChanges();
  }

  //แสดงชื่อสิทธิ์ผู้ใช้งาน
  getTypeName(role: InRoleDocument) {
    if (InRoleDocument[role] == InRoleDocument[1])
      return 'ใบแจ้งหนี้';
    else if (InRoleDocument[role] == InRoleDocument[2])
      return 'เอกสารใบแจ้งหนี้';
    else if (InRoleDocument[role] == InRoleDocument[3])
      return 'ใบส่งของ';
    else if (InRoleDocument[role] == InRoleDocument[4])
      return 'บันทึกข้อความ';
    else
      return InRoleDocument[role];
  }

  onDeleteDocument(item: InDocument): void {
    // this.alert.askConfirm().then(status => {
    //   if (!status) return;
    this.document
      .deleteDocument(item.id)
      .then(() => {
        //โหลดข้อมูลเอกสารใหม่
        this.initialLoadDocuments({
          searchText: this.getSearchText,
          searchType: this.searchType.key,
          startPage: this.startPage,
          limitPage: this.limitPage
        });
        this.alert.notify('ลบข่อมูลสำเร็จ', 'info');
      })
      .catch(err => this.alert.notify(err.Message));
    // });
  }

  async onLookDocument(item: InDocument) {
    const doc = await this.document.getDocumentById(item.id);
    const doc2 = JSON.stringify(doc);
    const doc3 = JSON.parse(doc2);
    const doc4: InInvoice = doc3;
    this.pdf.generateInvoice(doc4);
    // const doc2: InInvoice = Object.keys(doc).map(
    //   (key: string): string => doc 
    // )
    // this.document
    //   .getDocumentById(item.id)
    //   .then(doc => {
    //     this.docInvoice = doc;
    //   })
    //   .then(doc => {
    //     if(doc.type == 1) {
    //       console.log("doc: " +doc);
    //       console.log("docInvoice: "+ this.docInvoice);
    //       this.pdf.generateInvoice(this.docInvoice);
    //     }
    //   })
    //   .catch(err => this.alert.notify(err.Message))

  }

  private get getSearchText() {
    let responseSearchText = null;
    switch (this.searchType.key) {
      case 'type':
        responseSearchText = InRoleDocument[this.searchText] || '';
        break;
      case 'updated':
        const searchDate: { from: Date, to: Date } = { from: this.searchText[0], to: this.searchText[1] } as any;
        searchDate.from.setHours(0);
        searchDate.from.setMinutes(0);
        searchDate.from.setSeconds(0);
        searchDate.to.setHours(23);
        searchDate.to.setMinutes(59);
        searchDate.to.setSeconds(59);
        responseSearchText = searchDate;
        break;
      default:
        responseSearchText = this.searchText;
        break;
    }
    return responseSearchText;
  }


  // โหลดข้อมูลเอกสาร
  private initialLoadDocuments(options?: InDocumentSearch) {
    this.document
      .getDocuments(options)
      .then(items => {
        this.items = items;
        // console.log(this.items);
      })
      .catch(err => this.alert.notify(err.Message));
  }

  // โหลดข้อมูลผู้ใช้ที่ยัง Login
  private initialLoadUserLogin() {
    this.UserLogin = this.account.userLogin;
    this.account
      .getUserLogin(this.authen.getAuthenticated())
      .then(userLogin => this.UserLogin = userLogin)
      .catch(err => this.alert.notify(err.Message));
  }

  private async generateForm(doc: InDocument) {
    if (doc.type == 1) {
      this.docInvoice.address = doc.address;
      this.docInvoice.date = doc.date;
      this.docInvoice.forwarder = doc.forwarder;
      this.docInvoice.forwarder_position = doc.forwarder_position;
      this.docInvoice.guarantee = doc.guarantee;
      this.docInvoice.payment_due = parseInt(doc.payment_due);
      this.docInvoice.product_detail_1 = doc.product_detail_1;
      this.docInvoice.product_number_1 = doc.product_number_1;
      this.docInvoice.product_prize_1 = doc.product_prize_1;
      this.docInvoice.product_detail_2 = doc.product_detail_2;
      this.docInvoice.product_number_2 = doc.product_number_2;
      this.docInvoice.product_prize_2 = doc.product_prize_2;
      this.docInvoice.product_total_prize = doc.product_total_prize;
      this.docInvoice.type = doc.type;
      console.log(this.docInvoice);
    }
  }

}
