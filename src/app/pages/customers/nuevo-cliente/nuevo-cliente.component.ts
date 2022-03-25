import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CustomerService } from 'src/app/services/customer.service';
@Component({
  selector: 'app-nuevo-cliente',
  templateUrl: './nuevo-cliente.component.html',
  styleUrls: ['./nuevo-cliente.component.css']
})
export class NuevoClienteComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private customerService : CustomerService,public dialogRef: MatDialogRef<NuevoClienteComponent>) { }
  nombre? : FormControl
  empresa? : FormControl
  ngOnInit(): void {
    this.nombre = new FormControl(this.data.nombre) 
    this.empresa = new FormControl(this.data.empresa) 
  }
///crearCliente(select.value,empresa.value,nombre.value)
  crearCliente(select : number, empresa : string, nombre : string){
    this.customerService.insertaCliente({empresa:empresa, nombre: nombre,estatus:select}).toPromise();
    this.dialogRef.close("Se ha creado el usuario")
    console.log("si entro");
  }

}
