import { FormGroup } from "@angular/forms";
import { BsModalRef } from "ngx-bootstrap/modal";

export interface InSuccessProcessComponent{
    modalRef: BsModalRef;
    form: FormGroup;

    onSubmit();
}


export interface InSuccessProcess{
    success_time: string;
    success_id_doc: string;
    note: string;
}