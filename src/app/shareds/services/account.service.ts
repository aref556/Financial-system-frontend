import { Injectable } from "@angular/core";
import { InModalChangePassword } from "src/app/authentication/components/profile/modal-change-password/modal-change-password.interface";
import { InProfile } from "src/app/authentication/components/profile/profile.interface";
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
        this.userLogin.role = userLogin.role;
        this.userLogin.position = userLogin.position;
        return this.userLogin;
    }

    //แก้ไขข้อมูลส่วนตัว
    onUpdateProfile(accessToken: string, model: InProfile) {
        return (this.http
            .requestPost(`api/user/profile`, model, accessToken)
            .toPromise() as Promise<InAccount>)
            .then(user => this.setUserLogin(user));
    }

    onUpdatePassword(accessToken: string, model: InModalChangePassword) {
        return this.http
            .requestPost(`api/user/change-password`, model, accessToken)
            .toPromise() as Promise<{ status: boolean }>;
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

    firstname: string;
    lastname: string;
    position: string;
    role: InRoleAccount;

    id: string;
}

export enum InRoleAccount {
    Admin = 1,
    SuperAdmin = 2

}