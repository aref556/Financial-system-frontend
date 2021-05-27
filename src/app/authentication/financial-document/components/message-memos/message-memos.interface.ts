import { FormGroup } from "@angular/forms";
import { InInvoiceDocument } from "../invoice-document/invoice-document.interface";
import { ForwarderSelect, TypeIncome } from "../invoice/invoice.interface";

export interface InMessageMemosComponent {
    form: FormGroup;
    doc: InInvoiceDocument;
    forwarders: ForwarderSelect[];
    forwarder_select: ForwarderSelect;
    type_income: TypeIncome[];
    type_income_select: TypeIncome;

    onSubmit(): void;
    onSelectType(select: TypeIncome): void;
}

export interface InMessageMemos {
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