import { TemplateRef } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { BsModalRef } from "ngx-bootstrap/modal";

export interface InModalChangePasswordComponent {

    modalRef: BsModalRef;
    form: FormGroup;

    onSubmit();

}

export interface InModalChangePassword {
    origin_pass: string;
    new_pass: string;
}