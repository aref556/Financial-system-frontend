import { FormGroup } from "@angular/forms";
import { ForwarderSelect, TypeIncome } from "../invoice/invoice.interface";
export interface InDeliveryComponent {
    form: FormGroup;
    doc: InDelivery;
    forwarders: ForwarderSelect[];
    forwarder_select: ForwarderSelect;
    type_income: TypeIncome[];
    type_income_select: TypeIncome;

    onSubmit(): void;
    onTest(select: TypeIncome): void;
}

export interface InDelivery {
    date: string;
    address: string;
    payment_due: number;
    prize_stand: number;
    guarantee: number;
    product_detail_1: string;
    product_number_1: number;
    product_prize_1: number;
    product_detail_2: string;
    product_number_2: number;
    product_prize_2: number;
    type: number;
    forwarder: string;
    forwarder_position: string;
    type_income: string;

}