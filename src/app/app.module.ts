import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { CustomMaterialModule } from './custom-material/custom-material.module';
import { CommonModule } from '@angular/common';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { LoggerModule } from 'ngx-logger';
import { environment } from '../environments/environment';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ToastrModule } from "ngx-toastr";
import { LoginContactoComponent } from './auth2/login-contacto/login-contacto.component';
import { LoginUsuarioComponent } from './auth2/login-usuario/login-usuario.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginContactoComponent,
    LoginUsuarioComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    SharedModule,
    AppRoutingModule,
    ToastrModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    CustomMaterialModule,
    ToastrModule.forRoot(),
    
  ],
  exports:[
    CustomMaterialModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
