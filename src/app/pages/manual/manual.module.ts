import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FileDragNDropDirective } from './file-drag-n-drop.directive';
import { ManualRoutingModule } from './manual-routing.module';
import { ManualComponent } from './manual.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NewManualComponent } from './popup/new-manual/new-manual.component';
import { DeleteManualComponent } from './popup/delete-manual/delete-manual.component';
import { MatPaginatorModule } from '@angular/material/paginator';


@NgModule({
  declarations: [
    ManualComponent,
    NewManualComponent,
    DeleteManualComponent,
    FileDragNDropDirective
  ],
  imports: [
    CommonModule,
    ManualRoutingModule,
    SharedModule,
    MatPaginatorModule
  ]
  
})
export class ManualModule { }
