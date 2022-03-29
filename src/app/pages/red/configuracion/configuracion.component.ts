import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CustomerService } from 'src/app/services/customer.service';
@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.css']
})
export class ConfiguracionComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private customerService : CustomerService,public dialogRef: MatDialogRef<ConfiguracionComponent>) { }
  nombre? : FormControl
  empresa? : FormControl

  ngOnInit(): void {
    if(this.data.opc == false){
    this.nombre = new FormControl(this.data.nombre) 
    this.empresa = new FormControl(this.data.empresa)
    } 
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
      this.customerService.acualizarCliente({id:this.data.id,empresa:empresa, nombre: nombre,estatus:select}).toPromise();
      this.dialogRef.close({empresa:empresa, nombre: nombre,estatus:select, mensaje:"Se pudo"})
    }else{
      alert("Llene todos los datos")
    }
    
    }
  }

}

