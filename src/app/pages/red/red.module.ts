import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RedRoutingModule } from './red-routing.module';
import { SegmentsComponent } from './segments/segments.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SharedModule } from 'src/app/shared/shared.module';
import { NewSegmentComponent } from './popup/new-segment/new-segment.component';
import { DeleteComponent } from './popup/delete/delete.component';
import { InfoComponent } from './popup/info/info.component';
import { ControlipsComponent } from './controlips/controlips.component';
import { ConfiguracionComponent } from './popup/configuracion/configuracion.component';
import { RepetidoraycontactoComponent } from './repetidoraycontacto/repetidoraycontacto.component';
import { RepetidoraComponent } from './repetidora/repetidora.component';
import { NewRepeaterComponent } from './popup/new-repeater/new-repeater.component';
import { NewContactComponent } from './popup/new-contact/new-contact.component';
@NgModule({
  declarations: [   
    SegmentsComponent, 
    NewSegmentComponent, 
    DeleteComponent, 
    InfoComponent,
    ControlipsComponent,
    ConfiguracionComponent,
    RepetidoraycontactoComponent,
    RepetidoraComponent,
    NewRepeaterComponent,
    NewContactComponent
    
  ],
  imports: [
    CommonModule,
    RedRoutingModule,
    SharedModule,
    MatPaginatorModule,
  ]
})
export class RedModule { }
