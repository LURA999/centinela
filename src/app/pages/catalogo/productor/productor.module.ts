import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductorComponent } from './prodcutor.component';
import { ProductorRoutingModule } from './productor-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ManualComponent } from '../../manual/manual.component';
import { NewManualComponent } from '../../manual/popup/new-manual/new-manual.component';
import { DeleteManualComponent } from '../../manual/popup/delete-manual/delete-manual.component';
import { FileDragNDropDirective } from '../../manual/file-drag-n-drop.directive';
import { EditManualComponent } from '../../manual/popup/edit-manual/edit-manual.component';



@NgModule({
  declarations: [ ProductorComponent],
  imports: [
    ProductorRoutingModule,
    CommonModule,
    SharedModule,
    MatPaginatorModule
  ]
})
export class ProductorModule { }
