import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashAdminGuard } from 'src/app/core/guards/dashAdmin.guard';
import { LayoutComponent } from 'src/app/shared/layout/layout.component';
import { ServiceComponent } from './service/service.component';
import { TicketComponent } from './ticket/ticket.component';

const routes: Routes = [
  
  {  path: '',
  component: LayoutComponent,
  children:[
    { path: 'ticket', canActivate:[DashAdminGuard], component: TicketComponent },
    { path: 'service',canActivate:[DashAdminGuard], component: ServiceComponent },
  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
