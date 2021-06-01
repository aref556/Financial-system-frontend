import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceDocumentComponent } from './components/invoice-document/invoice-document.component';
import { InvoiceComponent } from './components/invoice/invoice.component';
import { DeliveryComponent } from './components/delivery/delivery.component';
import { SharedsModule } from 'src/app/shareds/shareds.module';
import { MessageMemosComponent } from './components/message-memos/message-memos.component';
import { AuthenticationModule } from '../authentication.module';
// import { AuthenticationRouting } from '../authentication.routing';



@NgModule({
  declarations: [
    InvoiceDocumentComponent,
    InvoiceComponent,
    DeliveryComponent,
    MessageMemosComponent,
  ],
  imports: [
    CommonModule,
    // AuthenticationRouting,
    SharedsModule,
  ],
})
export class FinancialDocumentModule { }
