import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DashboardTicketsComponent } from './dashboard-tickets/dashboard-tickets.component';
import { DashboardRedComponent } from './dashboard-red/dashboard-red.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MatGridListModule } from '@angular/material/grid-list';
import { NgxPaginationModule } from "ngx-pagination";
import { ViewTicketsEnterpriseComponent } from './forms/view-tickets-enterprise/view-tickets-enterprise.component';
import { ViewEstatusEnterpriseComponent } from './forms/view-estatus-enterprise/view-estatus-enterprise.component';
import { TableTicketsComponent } from './table/table-tickets/table-tickets.component';
@NgModule({
  declarations: [DashboardHomeComponent, DashboardTicketsComponent, DashboardRedComponent, ViewTicketsEnterpriseComponent, ViewEstatusEnterpriseComponent, TableTicketsComponent],
  imports: [
    NgApexchartsModule,
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    MatGridListModule,
    NgxPaginationModule
  ],
  entryComponents: []
})
export class DashboardModule { }
