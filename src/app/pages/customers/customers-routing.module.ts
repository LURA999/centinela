import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from 'src/app/shared/layout/layout.component';
import { CustomerCompanyComponent } from './customer-company/customer-company.component';

import { CustomerListComponent } from './customer-list/customer-list.component';
import { TableServiceComponent } from './table-service/table-service.component';
import { TableTicketsComponent } from './table-tickets/table-tickets.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent, 
    children: [
      { path: '', component: CustomerListComponent },
      { path: ':id', component: CustomerCompanyComponent},
      { path: ":id/service", component: TableServiceComponent},
      { path: ":id/ticket", component: TableTicketsComponent},

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomersRoutingModule { }
