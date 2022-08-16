import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SharedModule } from 'src/app/shared/shared.module';
import { DeleteUserComponent } from './popup/delete-user/delete-user.component';
import { EditUserComponent } from './popup/edit-user/edit-user.component';
import { NewUserComponent } from './popup/new-user/new-user.component';


@NgModule({
  declarations: [
    UsersComponent,
    NewUserComponent,
    DeleteUserComponent,
    EditUserComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatPaginatorModule,
    UsersRoutingModule,
  ]
})
export class UsersModule { }
