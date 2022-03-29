import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RepeaterComponent } from './repeater.component';

const routes: Routes = [{ path: '', component: RepeaterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RepeaterRoutingModule { }
