import { FormGroup } from "@angular/forms";

export interface InLoginComponent {
    Url: any;
    returnURL: string;
    form: FormGroup;
    
    onSubmit(): void;
}

export interface InLogin {
    username: string;
    password: string;
}