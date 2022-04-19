import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfiguracionRoutingModule } from './configuracion-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { MatPaginatorModule } from '@angular/material/paginator';
import { DateComponent } from './date/date.component';
import { SmtpComponent } from './smtp/smtp.component';
import { NotificationComponent } from './notification/notification.component';
import {MatTabsModule} from '@angular/material/tabs';
import { NuevaimagenComponent } from './nuevaimagen/nuevaimagen.component';
import { NotifierModule } from 'angular-notifier';
import { right } from '@popperjs/core';

@NgModule({
  imports: [
    NgbPaginationModule,
    CommonModule,
    ConfiguracionRoutingModule,
    SharedModule,
    MatPaginatorModule,
    MatTabsModule, 
    NotifierModule.withConfig({
      
      position: {

        horizontal: {
      
          /**
           * Defines the horizontal position on the screen
           * @type {'left' | 'middle' | 'right'}
           */
          position: 'right',
      
          /**
           * Defines the horizontal distance to the screen edge (in px)
           * @type {number}
           */
          distance: 12
      
        },
      
        vertical: {
      
          /**
           * Defines the vertical position on the screen
           * @type {'top' | 'bottom'}
           */
          position: 'bottom',
      
          /**
           * Defines the vertical distance to the screen edge (in px)
           * @type {number}
           */
          distance: 12
      
          
      
        }
      
      }


      
    }),
   
  ],
  declarations: [



               DateComponent,
               SmtpComponent,
               NotificationComponent,
               NuevaimagenComponent
  ],
  exports: [
    MatTabsModule,
    
    
  ]
})
export class ConfiguracionModule { }
