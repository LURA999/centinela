import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { lastValueFrom, Subscription } from 'rxjs';
import { ContactService } from 'src/app/core/services/contact.service';
import { DeviceService } from 'src/app/core/services/device.service';
import { RsService } from 'src/app/core/services/rs.service';
import { ServiceService } from 'src/app/core/services/services.service';
import { CustomerService } from '../../../../core/services/customer.service';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.css']
})
export class DeleteComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, 
  private servicioCliente : CustomerService, private serviceService : ServiceService,public dialogRef: MatDialogRef<DeleteComponent>
  ,private contact : ContactService, private rs : RsService, private deviceService:DeviceService) { }
  $sub = new Subscription();
  ngOnInit(): void {

  }
  

  async confirmar(){
    this.data.salir = false;

    switch(Number(this.data.opc)){
      case 0:
        lastValueFrom(await this.servicioCliente.eliminarFalso(this.data.idCliente));
        break;
      case 1:
        lastValueFrom(await this.contact.deleteContactos_tServicos(this.data.idCliente));
        break;
      case 2:
        lastValueFrom(await this.servicioCliente.eliminarFalso(this.data.idCliente));
        break;
      case 3:
        lastValueFrom(await this.rs.deleteRS(this.data.idCliente));
        break;
      case 4:
        lastValueFrom(await this.serviceService.deleteService(this.data.idCliente));
        break;  
      case 5:
          lastValueFrom(await this.servicioCliente.eliminarFalso(this.data.idCliente));
        break;
      case 6:
        break;  
      case 7:        
          lastValueFrom(await this.deviceService.eliminarRadio(this.data.idCliente));
        break;
      case 8:
        break;
    }
    this.dialogRef.close('Se ha eliminado con exito');
  }

  ngOnDestroy(): void {
    
  }
  closeDialog(){
    this.$sub.unsubscribe();
  }
}
