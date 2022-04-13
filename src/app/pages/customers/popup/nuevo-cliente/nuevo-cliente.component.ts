import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CustomerService } from '../../../../core/services/customer.service';
@Component({
  selector: 'app-nuevo-cliente',
  templateUrl: './nuevo-cliente.component.html',
  styleUrls: ['./nuevo-cliente.component.css']
})
export class NuevoClienteComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private customerService : CustomerService,public dialogRef: MatDialogRef<NuevoClienteComponent>) { }


  ngOnInit(): void {
 
  }

  crearCliente(select : number, empresa : string, nombre : string){
    
    if(this.data.opc == false){
      if(empresa.length >0 && nombre.length > 0 && select !=undefined ){
    this.customerService.insertaCliente({empresa:empresa, nombre: nombre,estatus:select}).toPromise();
    this.dialogRef.close({empresa:empresa, nombre: nombre,estatus:select, mensaje:"Se pudo"})
      }else{
        alert("Llene todos los datos")
      }
    }else{
      if(empresa.length >0 && nombre.length > 0 && select !=undefined){
      this.customerService.acualizarCliente({id:this.data.id,empresa:empresa, nombre: nombre,estatus:select, idCliente:+this.data.idSegment}).toPromise();
      this.dialogRef.close({empresa:empresa, nombre: nombre,estatus:select, mensaje:"Se pudo"})
    }else{
      alert("Llene todos los datos")
    }
    }
  }

}