import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TicketsRoutingModule } from './tickets-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { TicketEntryComponent } from './ticket-entry/ticket-entry.component';
import { SearchIdComponent } from './popup/search-id/search-id.component';
import { MatRadioModule } from '@angular/material/radio';
import { NewContactComponent } from './popup/new-contact/new-contact.component';
import { AllTicketsComponent } from './all-tickets/all-tickets.component';
import { VistaTicketComponent } from './vista-ticket/vista-ticket.component';


@NgModule({
  declarations: [
    TicketEntryComponent,
    SearchIdComponent,
    NewContactComponent,
    AllTicketsComponent,
    VistaTicketComponent
  ],
  imports: [
    CommonModule,
    TicketsRoutingModule,
    SharedModule,
    MatRadioModule
  ]
})
export class TicketsModule { }
