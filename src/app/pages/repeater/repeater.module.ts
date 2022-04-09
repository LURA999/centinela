import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RepeaterRoutingModule } from './repeater-routing.module';
import { RepetidoraComponent } from './repetidora/repetidora.component';
import { RepetidoraycontactoComponent } from './repetidoraycontacto/repetidoraycontacto.component';
import { MatPaginator } from '@angular/material/paginator';
import { NewRepeaterComponent } from './popup/new-repeater/new-repeater.component';
import { NewContactComponent } from './popup/new-contact/new-contact.component';

import { MatPaginatorModule } from '@angular/material/paginator';
import { SharedModule } from 'src/app/shared/shared.module';
import { DeleteComponent } from './popup/delete/delete.component';


@NgModule({
  declarations: [
    RepetidoraComponent,
    RepetidoraycontactoComponent,
    NewRepeaterComponent,
    NewContactComponent,
   
    RepetidoraComponent,
    RepetidoraycontactoComponent,
    DeleteComponent,
  ],
  imports: [
    CommonModule,
    RepeaterRoutingModule,
    SharedModule,
    MatPaginatorModule
  ]
})
export class RepeaterModule { }
