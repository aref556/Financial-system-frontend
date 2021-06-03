import { Injectable } from "@angular/core";
import { InDocumentList, InDocumentSearch } from "src/app/authentication/components/financial-list/financial-list.interface";
import { InDelivery } from "src/app/authentication/financial-document/components/delivery/delivery.interface";
import { InInvoiceDocument } from "src/app/authentication/financial-document/components/invoice-document/invoice-document.interface";
import { InInvoice } from "src/app/authentication/financial-document/components/invoice/invoice.interface";
import { InMessageMemos } from "src/app/authentication/financial-document/components/message-memos/message-memos.interface";
import { AuthenService } from "src/app/services/authen.service";
import { HttpService } from "src/app/services/http.service";
import { InSuccessProcess } from "../components/financial-list/success-process/success-process.interface";
declare let $;
@Injectable()
export class FinancialDocumentService {
    constructor(
        private http: HttpService,
        private auth: AuthenService,
    ){ }

    onCreateDelivery(model: InDelivery) {
        return this.http
            .requestPost('api/document/create-delivery', model, this.auth.getAuthenticated())
            .toPromise() as Promise<InDelivery>;
    }
    onCreateInvoice(model: InInvoice) {
        return this.http
            .requestPost('api/document/create-invioce', model, this.auth.getAuthenticated())
            .toPromise() as Promise<InInvoice>;
    }

    onCreateInvoiceDocument(model: InInvoiceDocument) {
        return this.http
            .requestPost('api/document/create-invioce-document', model, this.auth.getAuthenticated())
            .toPromise() as Promise<InInvoiceDocument>;
    }

    onCreateMessageMemos(model: InMessageMemos) {
        return this.http
            .requestPost('api/document/create-message-memos', model, this.auth.getAuthenticated())
            .toPromise() as Promise<InMessageMemos>;
    }

    //ดึงข้อมูลเอกสารทั้งหมด
    getDocuments(options?: InDocumentSearch) {
        return this.http
            .requestGet(`api/document?${$.param(options)}`, this.auth.getAuthenticated())
            .toPromise() as Promise<InDocumentList>;
    }

    // ดึงข้อมูลเอกสารอันเดียว
    getDocumentById(id : any) {
        return this.http
            .requestGet(`api/document/${id}`, this.auth.getAuthenticated())
            .toPromise() as Promise<InDocument>;
    }

    //ลบข้อมูลดเอกสาร
    deleteDocument( id: any) {
        return this.http
            .requestDelete(`api/document/${id}`, this.auth.getAuthenticated())
            .toPromise() as Promise<number>;
    }

    // แก้ไขข้อมูลสถานะการดำเนินงาน
    updateFlagStatus(id: any, model: InSuccessProcess) {
        return this.http
            .requestPut(`api/document/handle-status/${id}`, model, this.auth.getAuthenticated() )
            .toPromise() as Promise<InDocument>;
    }

}

export interface InDocument {
    id: string;
    type: InRoleDocument;
    address: string;
    payment_due: string,
    guarantee: number;
    product_detail_1: string;
    product_number_1: number;
    product_prize_1: number;
    product_detail_2: string;
    product_number_2: number;
    product_prize_2: number;
    product_total_prize: number;
    date: string;
    forwarder: string;
    forwarder_position: string;

    id_doc: string;
    title: string;
    title_to: string;
    message: string;
    guarantor: string;
    guarantor_position: string;

    prize_stand: number;

    created_by: string;
    created_time: Date;
    success_time: string,
    flag_status: InFlagStatus,
    type_income: string,

}

export enum InFlagStatus {
    Pending = 1,
    Success = 2,
}

export enum InRoleDocument {
    Invoice = 1,
    InvoiceDocument = 2,
    Delivery = 3,
    MessageMemos = 4,
}
