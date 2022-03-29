import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginContactoComponent } from './auth/login-contacto/login-contacto.component';
import { LoginUsuarioComponent } from './auth/login-usuario/login-usuario.component';
import { InicioGuard } from './core/guards/inicio.guard';
import { DashUsuarioGuard } from './core/guards/dashUsuario.guard';
import { DashAdminGuard } from './core/guards/dashAdmin.guard';


const appRoutes: Routes = [ 
  { path: 'admin/clientes', canActivate:[DashAdminGuard],loadChildren: () => import('../app/pages/customers/customers.module').then(m => m.CustomersModule) },
  { path: 'usuario',canActivate:[InicioGuard], component: LoginUsuarioComponent },
  { path: 'admin',canActivate:[InicioGuard], component: LoginContactoComponent },
  { path: 'admin/dashboard',canActivate:[DashAdminGuard], loadChildren: () => import('../app/pages/dashboard/dashboard.module').then(m => m.DashboardModule) },
  { path: 'usuario/dashboard',canActivate:[DashUsuarioGuard], loadChildren: () => import('../app/pages/dashboard/dashboard.module').then(m => m.DashboardModule) },
  { path: 'admin/red', loadChildren: () => import('./pages/red/red.module').then(m => m.RedModule) },
  { path: '',canActivate:[InicioGuard],component: LoginUsuarioComponent},
  { path: 'admin/red',canActivate:[DashAdminGuard], loadChildren: () => import('./pages/red/red.module').then(m => m.RedModule) },

  { path: '**',canActivate:[InicioGuard], component: LoginUsuarioComponent},  
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
