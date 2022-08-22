import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SharedModule } from 'src/app/shared/shared.module';
import { DeleteUserComponent } from './popup/delete-user/delete-user.component';
import { EditUserComponent } from './popup/edit-user/edit-user.component';
import { NewUserComponent } from './popup/new-user/new-user.component';
import { GruposComponent } from './grupos/grupos.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { NewGroupComponent } from './popup/new-group/new-group.component';
import { EditGroupComponent } from './popup/edit-group/edit-group.component';
import { DeleteGroupComponent } from './popup/delete-group/delete-group.component';


@NgModule({
  declarations: [
    NewUserComponent,
    DeleteUserComponent,
    EditUserComponent,
    GruposComponent,
   UsuariosComponent,
   DeleteGroupComponent,
   EditGroupComponent,
   NewGroupComponent
    
  ],
  imports: [
    
    CommonModule,
    SharedModule,
    MatPaginatorModule,
    UsersRoutingModule,
  ]
})
export class UsersModule { }
