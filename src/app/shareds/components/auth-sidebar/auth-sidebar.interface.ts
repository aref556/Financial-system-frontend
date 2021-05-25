import { InAccount, InRoleAccount } from "../../services/account.service";

export interface InAuthSidebarComponent {
    AppURL: any;
    AuthURL: any;
    UserLogin: InAccount;
    Role: typeof InRoleAccount;
}