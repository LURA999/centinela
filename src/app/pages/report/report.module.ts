import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { ReportsRoutingModule } from './report-routing.module';
import { TicketComponent } from './ticket/ticket.component';
import { ServiceComponent } from './service/service.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
  
    TicketComponent,
    ServiceComponent
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    SharedModule,
    NgbPaginationModule
  ]
})
export class ReportsModule { }
