import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RepeaterRoutingModule } from './repeater-routing.module';
import { RepeaterComponent } from './repeater.component';
import { RepetidoraComponent } from './repetidora/repetidora.component';
import { NuevarepetidoraComponent } from './nuevarepetidora/nuevarepetidora.component';
import { RepetidoraycontactoComponent } from './repetidoraycontacto/repetidoraycontacto.component';
import { NuevocontactoComponent } from './nuevocontacto/nuevocontacto.component';
import { NewregisterComponent } from './newregister/newregister.component';


@NgModule({
  declarations: [
    RepeaterComponent,
    RepetidoraComponent,
    NuevarepetidoraComponent,
    RepetidoraycontactoComponent,
    NuevocontactoComponent,
    NewregisterComponent
  ],
  imports: [
    CommonModule,
    RepeaterRoutingModule
  ]
})
export class RepeaterModule { }
