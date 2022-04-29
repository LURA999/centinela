import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { lastValueFrom, Subscription } from 'rxjs';
import { ContactService } from 'src/app/core/services/contact.service';
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
  ,private contact : ContactService, private rs : RsService) { }
  $sub = new Subscription();
  ngOnInit(): void {

    console.log(this.data)
  }
  

  async confirmar(){
  if(this.data.opc == 0){
    lastValueFrom(await this.servicioCliente.eliminarFalso(this.data.idCliente));
  }else if(this.data.opc == 1){
    lastValueFrom(await this.contact.deleteContactos_tServicos(this.data.idCliente));
  }else if(this.data.opc == 2){
    lastValueFrom(await this.servicioCliente.eliminarFalso(this.data.idCliente));
  }else if(this.data.opc == 3){
    lastValueFrom(await this.rs.deleteRS(this.data.idCliente));
  }else if(this.data.opc == 4){
    lastValueFrom(await this.serviceService.deleteService(this.data.idCliente));
  }else if(this.data.opc == 5){
    lastValueFrom(await this.servicioCliente.eliminarFalso(this.data.idCliente));

  }
    this.dialogRef.close('Se ha eliminado con exito');
  }

  ngOnDestroy(): void {
    
  }
  closeDialog(){
    this.$sub.unsubscribe();
  }
}
