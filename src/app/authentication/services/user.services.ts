import { Injectable } from "@angular/core";
import { AuthenService } from "src/app/services/authen.service";
import { HttpService } from "src/app/services/http.service";
import { AccountService } from "src/app/shareds/services/account.service";
import { InDelivery } from "../financial-document/components/delivery/delivery.interface";
import { InInvoiceDocument } from "../financial-document/components/invoice-document/invoice-document.interface";
import { InInvoice } from "../financial-document/components/invoice/invoice.interface";
import { InMessageMemos } from "../financial-document/components/message-memos/message-memos.interface";

@Injectable()
export class UserService {
    constructor(
        private http: HttpService,
        private auth: AuthenService,
    ) { }
    
}