import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DashboardTicketsComponent } from './dashboard-tickets/dashboard-tickets.component';
import { DashboardRedComponent } from './dashboard-red/dashboard-red.component';
import { NgApexchartsModule } from 'ng-apexcharts';


@NgModule({
  declarations: [DashboardHomeComponent, DashboardTicketsComponent, DashboardRedComponent],
  imports: [
    NgApexchartsModule,
    CommonModule,
    DashboardRoutingModule,
    SharedModule
    
  ],
  entryComponents: []
})
export class DashboardModule { }
