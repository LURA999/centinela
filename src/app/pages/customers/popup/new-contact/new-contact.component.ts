import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import { ContactService } from 'src/app/core/services/contact.service';
import { RolService } from 'src/app/core/services/rol.service';
import { ContactServiceModel } from 'src/app/models/contactService.model';
import { responseService } from 'src/app/models/responseService.model';

@Component({
  selector: 'app-new-contact',
  templateUrl: './new-contact.component.html',
  styleUrls: ['./new-contact.component.css']
})
export class NewContactComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<NewContactComponent>, private rol : RolService
  ,private contacto : ContactService) { }
  contactoModel = new ContactServiceModel();
  ngOnInit(): void {
    console.log(this.data.arrayServicios);
    
  }
  crearContacto(nombre : string, materno : string,paterno : string,correo : string,selectEstatus : number,celular :string,telefono :string
    ,selectRol : number,selectServicio : number, puesto : string){
    this.contactoModel.nombre = nombre;
    this.contactoModel.materno = materno;
    this.contactoModel.paterno = paterno;
    this.contactoModel.correo = correo;
    this.contactoModel.estatus= selectEstatus;
    this.contactoModel.celular = celular;
    this.contactoModel.telefono = telefono;
    this.contactoModel.rol = selectRol;
    this.contactoModel.puesto = puesto;
    this.contactoModel.cveServicio = selectServicio;
    this.contactoModel.cveContacto = this.data.proximoID;
console.log(this.contactoModel);

    if(this.data.opc == false){
      if(nombre.length > 0 && materno.length >0  && paterno.length > 0  && correo.length > 0 && selectEstatus != undefined  
        && celular.length>0  &&  selectRol != undefined && selectServicio != undefined){
        lastValueFrom(this.contacto.insertServicios_tServicos(this.contactoModel))
        this.dialogRef.close(this.contactoModel)
      }else{
        alert("Por favor llene los campos");
      }
    }else{

    }
  }

}
