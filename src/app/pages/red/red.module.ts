import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlipsComponent } from './controlips/controlips.component';
import { RedRoutingModule } from './red-routing.module';
import {MatPaginatorModule} from '@angular/material/paginator';
import { SharedModule } from 'src/app/shared/shared.module';

import { ConfiguracionComponent } from './configuracion/configuracion.component';


@NgModule({
  declarations: [
    ControlipsComponent,
    ConfiguracionComponent,
   
  ],
  imports: [
    CommonModule,
    RedRoutingModule,
    MatPaginatorModule,

    SharedModule,
  ]
})
export class RedModule { }
