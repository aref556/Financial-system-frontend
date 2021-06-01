import { TemplateRef } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { BsModalRef } from "ngx-bootstrap/modal";
import { InAccount } from "src/app/shareds/services/account.service";

export interface InProfileComponent {
    userLogin: InAccount;
    modalRef: BsModalRef;
    form: FormGroup;
    onSubmit();
    openModal(template: TemplateRef<any>);
}

// export interface InProfile {

// }
// ข้อมูลผู้ใช้งาน
export interface InProfile {
    username: string;
    firstname: string;
    lastname: string;
    position: string;
}
