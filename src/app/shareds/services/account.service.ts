import { Injectable } from "@angular/core";
import { InInvoiceDocument } from "src/app/authentication/financial-document/components/invoice-document/invoice-document.interface";
import { InLogin } from "src/app/components/login/login.interface";
import { AuthenService } from "src/app/services/authen.service";
import { HttpService } from "src/app/services/http.service";

@Injectable({
    providedIn: 'root',
})
export class AccountService {
    constructor(
        private http: HttpService,
        private auth: AuthenService,
    ) { }

    // เก็บช้อมูลของ user ไว้
    public userLogin: InAccount = {} as any;
    public setUserLogin(userLogin: InAccount) {
        this.userLogin.id = userLogin.id;
        this.userLogin.username = userLogin.username;
        this.userLogin.password = userLogin.password;
        this.userLogin.firstname = userLogin.firstname;
        this.userLogin.lastname = userLogin.lastname;
        this.userLogin.phone_number = userLogin.phone_number;
        this.userLogin.role = userLogin.role;
        return this.userLogin;
    }

    onLogin(model: InLogin) {
        return this.http
            .requestPost('api/account/login', model)
            .toPromise() as Promise<{ accessToken: string }>;
    }

    getUserLogin(accessToken: string) {
        return (this.http
            .requestGet('api/user/data', accessToken)
            .toPromise() as Promise<InAccount>)
            .then(userLogin => {
                console.log(userLogin);
                return this.setUserLogin(userLogin);
            });
    }
}

export interface InAccount {
    username: string;
    password: string;

    firstname: String;
    lastname: String;
    phone_number: String;
    role: InRoleAccount;

    id: string;
}

export enum InRoleAccount {
    Admin = 1,
    SuperAdmin = 2

}