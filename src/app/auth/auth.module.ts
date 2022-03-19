import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginContactoComponent } from './login-contacto/login-contacto.component';
import { LoginUsuarioComponent } from './login-usuario/login-usuario.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ToastrModule } from "ngx-toastr";
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    LoginContactoComponent,
    LoginUsuarioComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ToastrModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    ReactiveFormsModule
  ]
})
export class AuthModule { }
