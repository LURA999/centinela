import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from 'src/app/shared/layout/layout.component';
import { RepetidoraycontactoComponent } from './repetidoraycontacto/repetidoraycontacto.component';

const routes: Routes = [{ 
  path: '',
  component: LayoutComponent,
children: [
  {path: "repetidor-y-contacto" , component: RepetidoraycontactoComponent},
]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RepeaterRoutingModule { }
