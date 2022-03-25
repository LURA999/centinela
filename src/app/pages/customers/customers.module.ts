import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomersRoutingModule } from './customers-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NuevoClienteComponent } from './nuevo-cliente/nuevo-cliente.component';
import { DeleteComponent } from './delete/delete.component';
import { VarDirective } from './var.directive';

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
    VarDirective
  ],
  exports: [
    CustomerListComponent,
    NuevoClienteComponent
  ]
})
export class CustomersModule { }
