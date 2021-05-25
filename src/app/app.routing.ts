import { RouterModule, Routes } from "@angular/router";
import { AppURL } from "./app.url";
import { LoginComponent } from "./components/login/login.component";
import { AuthenticationModule } from "./authentication/authentication.module"


const RouteLists: Routes = [
    { path: '', redirectTo: AppURL.Login, pathMatch: 'full' },
    { path: AppURL.Login, component: LoginComponent },
    { 
        path: AppURL.Authen, loadChildren:() => {
            return AuthenticationModule;
        }
    },
];

export const AppRouting = RouterModule.forRoot(RouteLists);