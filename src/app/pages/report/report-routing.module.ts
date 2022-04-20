import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashAdminGuard } from 'src/app/core/guards/dashAdmin.guard';
import { LayoutComponent } from 'src/app/shared/layout/layout.component';
import { ServiceComponent } from './service/service.component';
import { TicketAdviserComponent } from './ticket-adviser/ticket-adviser.component';
import { TicketSopportComponent } from './ticket-sopport/ticket-sopport.component';

const routes: Routes = [
  
  {  path: '',
  component: LayoutComponent,
  children:[
    { path: 'ticket-adviser', canActivate:[DashAdminGuard], component: TicketAdviserComponent },
    { path: 'service',canActivate:[DashAdminGuard], component: ServiceComponent },
    { path: 'ticket-support',canActivate:[DashAdminGuard], component: TicketSopportComponent },

  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
