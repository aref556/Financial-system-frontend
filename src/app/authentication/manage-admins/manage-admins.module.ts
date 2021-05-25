import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminListComponent } from './components/admin-list/admin-list.component';
import { CreateAdminComponent } from './components/create-admin/create-admin.component';
import { SharedsModule } from 'src/app/shareds/shareds.module';




@NgModule({
  declarations: [
    AdminListComponent,
    CreateAdminComponent
  ],
  imports: [
    CommonModule,
    SharedsModule,
  ]
})
export class ManageAdminsModule { }
