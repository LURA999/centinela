import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashAdminGuard } from 'src/app/core/guards/dashAdmin.guard';
import { LayoutComponent } from 'src/app/shared/layout/layout.component';
import { DateComponent } from './date/date.component';
import { EditComponent } from './edit/edit.component';
import { NotificationComponent } from './notification/notification.component';
import { SmtpComponent } from './smtp/smtp.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent, 
    children: [
      { path: 'date', canActivate:[DashAdminGuard], component: DateComponent },    
        { path: "notification" , component: NotificationComponent},
      { path: "smtp" , component: SmtpComponent},
      { path: "edit" , component: EditComponent},
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfiguracionRoutingModule { }
