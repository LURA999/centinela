import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashAdminGuard } from 'src/app/core/guards/dashAdmin.guard';
import { LayoutComponent } from 'src/app/shared/layout/layout.component';
import { TicketEntryComponent } from './ticket-entry/ticket-entry.component';

const routes: Routes = [
  {  path: '',
  component: LayoutComponent,
  children:[
    { path: 'ticket-entry', canActivate:[DashAdminGuard], component: TicketEntryComponent }
  ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TicketsRoutingModule { }