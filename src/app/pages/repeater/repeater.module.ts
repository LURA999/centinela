import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RepeaterRoutingModule } from './repeater-routing.module';
import { RepetidoraComponent } from './repetidora/repetidora.component';
import { RepetidoraycontactoComponent } from './repetidoraycontacto/repetidoraycontacto.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatPaginator } from '@angular/material/paginator';
import { NewRepeaterComponent } from './new-repeater/new-repeater.component';
import { NewContactComponent } from './new-contact/new-contact.component';


@NgModule({
  declarations: [
    RepetidoraComponent,
    RepetidoraycontactoComponent,
    NewRepeaterComponent,
    NewContactComponent,
  ],
  imports: [
    CommonModule,
    RepeaterRoutingModule,
    SharedModule,
    MatPaginator
  ]
})
export class RepeaterModule { }
