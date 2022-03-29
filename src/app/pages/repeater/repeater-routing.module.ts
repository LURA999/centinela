import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashAdminGuard } from 'src/app/core/guards/dashAdmin.guard';
import { LayoutComponent } from 'src/app/shared/layout/layout.component';
import { RepetidoraComponent } from './repetidora/repetidora.component';
import { RepetidoraycontactoComponent } from './repetidoraycontacto/repetidoraycontacto.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'repetidora', canActivate:[DashAdminGuard], component: RepetidoraComponent },
      {path: "repetidor-y-contacto" , component: RepetidoraycontactoComponent},
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RepeaterRoutingModule { }
