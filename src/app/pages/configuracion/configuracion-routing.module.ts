import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashAdminGuard } from 'src/app/core/guards/dashAdmin.guard';
import { LayoutComponent } from 'src/app/shared/layout/layout.component';
import { ConfiguracionComponent } from './configuracion.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent, 
    children: [
      { path: '', component: ConfiguracionComponent },
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfiguracionRoutingModule { }
