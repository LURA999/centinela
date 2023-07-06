import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from 'src/app/shared/layout/layout.component';
import { billing } from 'src/app/core/guards/billing.guard';
import { ProductorComponent } from './prodcutor.component';
const routes: Routes = [
  {
    path: '',
    component: LayoutComponent, 
    children: [
    {path: '',canActivate:[billing], component: ProductorComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductorRoutingModule { }
