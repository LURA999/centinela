import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashAdminGuard } from 'src/app/core/guards/dashAdmin.guard';
import { LayoutComponent } from 'src/app/shared/layout/layout.component';
import { ControlipsComponent } from './controlips/controlips.component';
import { RepetidoraComponent } from './repetidora/repetidora.component';
import { RepetidoraycontactoComponent } from './repetidoraycontacto/repetidoraycontacto.component';
import { SegmentsComponent } from './segments/segments.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'segments', canActivate:[DashAdminGuard], component: SegmentsComponent },
      { path: 'controlips',canActivate:[DashAdminGuard], component: ControlipsComponent },
      { path: 'repeater', canActivate:[DashAdminGuard], component: RepetidoraComponent },
      { path: 'repeater/:id',canActivate:[DashAdminGuard], component: RepetidoraycontactoComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RedRoutingModule { }
