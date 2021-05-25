import { FormGroup } from "@angular/forms";
import { ForwarderSelect } from "../invoice/invoice.interface";

export interface InInvoiceDocumentComponent {
    form: FormGroup;
    doc: InInvoiceDocument;
    forwarders: ForwarderSelect[];
    forwarder_select: ForwarderSelect;

    onSubmit(): void;
}



export interface InInvoiceDocument {
    // ตัวแปรเตรียมเผื่อ
    // message_start: string;
    // id_tax: string;
    // message_end: string;
    // manager_name: string;
    // manager_position: string;

    //ข้อมูล เลขที่เอกสาร, วันที่, เรื่อง, เรียนที่อยู่, ที่อยู่ทางเลือก, ข้อความเริ่มต้น
    id_doc: string;
    date: string;
    title: string;
    title_to: string;
    address: string;
    message: string;
    type: number;
    guarantor: string;
    guarantor_position: string;


    
}