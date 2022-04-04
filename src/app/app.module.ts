import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { CustomMaterialModule } from './custom-material/custom-material.module';
import { CommonModule } from '@angular/common';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ToastrModule } from "ngx-toastr";
import { LoginContactoComponent } from './auth/login-contacto/login-contacto.component';
import { LoginUsuarioComponent } from './auth/login-usuario/login-usuario.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginContactoComponent,
    LoginUsuarioComponent,
    
  ],
  imports: [
    NgbModule,
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
    NgbPaginationModule,
  ],
  exports:[
    CustomMaterialModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
