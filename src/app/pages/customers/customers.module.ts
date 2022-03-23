import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomersRoutingModule } from './customers-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { MatPaginatorModule } from '@angular/material/paginator';

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
  ],
  entryComponents: [
  ]
})
export class CustomersModule { }
