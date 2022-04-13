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
import { ConfigurationComponent } from './popup/configuration/configuration.component';

@NgModule({
  declarations: [   
    SegmentsComponent, 
    NewSegmentComponent, 
    DeleteComponent, 
    InfoComponent,
    ControlipsComponent,
    ConfigurationComponent,
  ],
  imports: [
    CommonModule,
    RedRoutingModule,
    SharedModule,
    MatPaginatorModule,
  ]
})
export class RedModule { }
