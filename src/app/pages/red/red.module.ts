import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RedRoutingModule } from './red-routing.module';
import { SegmentsComponent } from './segments/segments.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SharedModule } from 'src/app/shared/shared.module';
import { NewSegmentComponent } from './new-segment/new-segment.component';
import { DeleteComponent } from './delete/delete.component';
import { InfoComponent } from './info/info.component';


@NgModule({
  declarations: [   
    SegmentsComponent, NewSegmentComponent, DeleteComponent, InfoComponent
  ],
  imports: [
    CommonModule,
    RedRoutingModule,
    SharedModule,
    MatPaginatorModule,
  ]
})
export class RedModule { }
