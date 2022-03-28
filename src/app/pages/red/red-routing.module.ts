import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from 'src/app/shared/layout/layout.component';
import { ControlipsComponent } from './controlips/controlips.component';
const routes: Routes = [{ 
  path: '',
    component: LayoutComponent,
    children: [
      { path: 'controlips', component: ControlipsComponent },
    ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RedRoutingModule { }
