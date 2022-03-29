import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RepeaterRoutingModule } from './repeater-routing.module';

import { RepetidoraComponent } from './repetidora/repetidora.component';
import { RepetidoraycontactoComponent } from './repetidoraycontacto/repetidoraycontacto.component';
import { NewregisterComponent } from './newregister/newregister.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
   
    RepetidoraComponent,
    RepetidoraycontactoComponent,
    NewregisterComponent,
  ],
  imports: [
    CommonModule,
    RepeaterRoutingModule,
    SharedModule,
    MatPaginatorModule
  ]
})
export class RepeaterModule { }
