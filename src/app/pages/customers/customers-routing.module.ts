import { FullscreenOverlayContainer } from '@angular/cdk/overlay';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Filler } from 'chart.js';
import { LayoutComponent } from 'src/app/shared/layout/layout.component';
import { CustomerCompanyComponent } from './customer-company/customer-company.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { TableEquipamentComponent } from './table-equipment/table-equipment.component';
import { TableRadioComponent } from './table-radio/table-radio.component';
import { TableRouterComponent } from './table-router/table-router.component';
import { ViewServiceComponent } from './view-service/view-service.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent, 
    children: [
      { path: '', component: CustomerListComponent },
      { path: ':id', component: CustomerCompanyComponent},

      { path: ":id/:identificador", component: ViewServiceComponent ,
        children:[
          {path: "",component:TableEquipamentComponent},
          {path: "radio",component:TableRadioComponent},
          {path: "router",component:TableRouterComponent}
        ]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomersRoutingModule { }
