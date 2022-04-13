import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomersRoutingModule } from './customers-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NuevoClienteComponent } from './popup/nuevo-cliente/nuevo-cliente.component';
import { DeleteComponent } from './popup/delete/delete.component';
import { CustomerCompanyComponent } from './customer-company/customer-company.component';
import { TableTicketsComponent } from './table-tickets/table-tickets.component';
import { TableServiceComponent } from './table-service/table-service.component';
import { TableLogComponent } from './table-log/table-log.component';
import { TableRsComponent } from './table-rs/table-rs.component';
import { TableContactComponent } from './table-contact/table-contact.component';

@NgModule({
  imports: [
    NgbPaginationModule,
    CommonModule,
    CustomersRoutingModule,
    SharedModule,
    MatPaginatorModule,
  ],
  declarations: [
    CustomerListComponent,
    NuevoClienteComponent,
    DeleteComponent,
    CustomerCompanyComponent,
    TableTicketsComponent,
    TableServiceComponent,
    TableLogComponent,
    TableRsComponent,
    TableContactComponent
  ],
  exports: [
    CustomerListComponent,
    NuevoClienteComponent
  ]
})
export class CustomersModule { }
