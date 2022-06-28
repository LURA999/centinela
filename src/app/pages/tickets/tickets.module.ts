import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TicketsRoutingModule } from './tickets-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { TicketEntryComponent } from './ticket-entry/ticket-entry.component';
import { SearchIdComponent } from './popup/search-id/search-id.component';


@NgModule({
  declarations: [
    TicketEntryComponent,
    SearchIdComponent
  ],
  imports: [
    CommonModule,
    TicketsRoutingModule,
    SharedModule
  ]
})
export class TicketsModule { }
