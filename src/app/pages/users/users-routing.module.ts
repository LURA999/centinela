import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashAdminGuard } from 'src/app/core/guards/dashAdmin.guard';
import { SupportGuard } from 'src/app/core/guards/support.guard';
import { LayoutComponent } from 'src/app/shared/layout/layout.component';
import { GruposComponent } from './grupos/grupos.component';
import { UsuariosComponent } from './usuarios/usuarios.component';


const routes: Routes = [
  {
    path: '',
    component: LayoutComponent, 
    children: [
      { path: 'usuarios', canActivate:[SupportGuard], component: UsuariosComponent },
      { path: 'grupos', canActivate:[SupportGuard], component: GruposComponent },

    ]}]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
