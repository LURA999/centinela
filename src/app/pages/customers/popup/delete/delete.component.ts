import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { firstValueFrom, Subscription } from 'rxjs';
import { CustomerService } from '../../../../core/services/customer.service';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.css']
})
export class DeleteComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private servicioCliente : CustomerService,public dialogRef: MatDialogRef<DeleteComponent>) { }
  $sub = new Subscription();
  ngOnInit(): void {

    console.log(this.data)
  }
  

  async confirmar(){
  if(this.data.opc == 0){
    firstValueFrom(await this.servicioCliente.eliminarFalso(this.data.idCliente));
  }else if(this.data.opc == 1){
    firstValueFrom(await this.servicioCliente.eliminarFalso(this.data.idCliente));
  }else if(this.data.opc == 2){
    firstValueFrom(await this.servicioCliente.eliminarFalso(this.data.idCliente));
  }else if(this.data.opc == 3){
    firstValueFrom(await this.servicioCliente.eliminarFalso(this.data.idCliente));
  }else if(this.data.opc == 4){
    firstValueFrom(await this.servicioCliente.eliminarFalso(this.data.idCliente));
  }else if(this.data.opc == 5){
    firstValueFrom(await this.servicioCliente.eliminarFalso(this.data.idCliente));

  }
    this.dialogRef.close('Se ha eliminado con exito');
  }

  ngOnDestroy(): void {
    
  }
  closeDialog(){
    this.$sub.unsubscribe();
  }
}
