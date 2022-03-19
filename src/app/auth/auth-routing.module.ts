import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginContactoComponent } from './login-contacto/login-contacto.component';
import { LoginUsuarioComponent } from './login-usuario/login-usuario.component';
import { InicioGuard } from '../core/guards/inicio.guard';
import { DashUsuarioGuard } from '../core/guards/dashUsuario.guard';
import { DashAdminGuard } from '../core/guards/dashAdmin.guard';

const routes: Routes = [
{ path: 'usuario',canActivate:[InicioGuard], component: LoginUsuarioComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
