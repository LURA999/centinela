import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfiguracionRoutingModule } from './configuracion-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NuevaimagenComponent } from './nuevaimagen/nuevaimagen.component';

@NgModule({
  imports: [
    NgbPaginationModule,
    CommonModule,
    ConfiguracionRoutingModule,
    SharedModule,
    MatPaginatorModule,
  ],
  declarations: [
  
  
  
    NuevaimagenComponent
  ],
  exports: [
   
  ]
})
export class ConfiguracionModule { }
