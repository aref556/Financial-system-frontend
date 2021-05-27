import { FormGroup } from "@angular/forms";

export interface InInvoiceComponent {
    form: FormGroup;
    doc: InInvoice;
    forwarders: ForwarderSelect[];
    forwarder_select: ForwarderSelect;
    type_income: TypeIncome[];
    type_income_select: TypeIncome;

    onSubmit(): void;
    onSelectType(select: TypeIncome): void;
}


export interface InInvoice {
    //เผื่อ
    // address_id: string;
    // email_1: string;
    // email_2: string;
    // address_target:string;
    // condition_prize: string;
    //ตัวแปรหลัก
    address: string;
    payment_due: number;
    guarantee: number;
    product_detail_1: string;
    product_number_1: number;
    product_prize_1: number;
    product_detail_2: string;
    product_number_2: number;
    product_prize_2: number;
    product_total_prize: number;
    date: string;
    type: number;
    forwarder: string;
    forwarder_position: string;
    type_income: string;

}

export interface ForwarderSelect {
    id: number;
    name: string;
    job_position: string;

}

export interface TypeIncome {
    id: number;
    type: string;
}
//ข้อมูลปรเภทของเอกสารแจ้งการชำระเงิน
// export enum RoleDocument {
//     Invoice = 1,
//     InvoiceDocument = 2,
//     Delivery = 3,
// }
