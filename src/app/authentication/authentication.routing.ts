import { RouterModule, Routes } from "@angular/router";
import { AuthURL } from "./authentication.url";

import { FinancialListComponent } from "./components/financial-list/financial-list.component";
import { ProfileComponent } from "./components/profile/profile.component";

import { DeliveryComponent } from "./financial-document/components/delivery/delivery.component";
import { InvoiceDocumentComponent } from "./financial-document/components/invoice-document/invoice-document.component";
import { InvoiceComponent } from "./financial-document/components/invoice/invoice.component";
import { MessageMemosComponent } from "./financial-document/components/message-memos/message-memos.component";
import { AdminListComponent } from "./manage-admins/components/admin-list/admin-list.component";
import { CreateAdminComponent } from "./manage-admins/components/create-admin/create-admin.component";
import { CreateUserComponent } from "./manage-users/components/create-user/create-user.component";
import { UserListComponent } from "./manage-users/components/user-list/user-list.component";
// import { FinancialDocumentModule } from "./financial-document/financial-document.module"
const RouteLists: Routes = [
    { path: '', redirectTo: AuthURL.Profile, pathMatch: 'full' },
    { path: AuthURL.Profile, component: ProfileComponent },
    { path: AuthURL.Financials, component: FinancialListComponent },
    { path: AuthURL.Users, component: UserListComponent },
    { path: AuthURL.Admins, component: AdminListComponent },
    { path: AuthURL.Invoice, component: InvoiceComponent },
    { path: AuthURL.InvoiceDocument, component: InvoiceDocumentComponent },
    { path: AuthURL.Delivery, component: DeliveryComponent },
    { path: AuthURL.CreateAdmin, component: CreateAdminComponent },
    { path: AuthURL.CreateUser, component: CreateUserComponent },
    { path: AuthURL.MessageMemos, component: MessageMemosComponent },
    // { path: AuthURL.FinancialDocuments, loadChildren: () => FinancialDocumentModule },

];

export const AuthenticationRouting = RouterModule.forChild(RouteLists);