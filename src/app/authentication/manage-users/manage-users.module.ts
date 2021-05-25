import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListComponent } from './components/user-list/user-list.component';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { SharedsModule } from 'src/app/shareds/shareds.module';




@NgModule({
  declarations: [
    UserListComponent,
    CreateUserComponent
  ],
  imports: [
    CommonModule,
    SharedsModule
  ]
})
export class ManageUsersModule { }
