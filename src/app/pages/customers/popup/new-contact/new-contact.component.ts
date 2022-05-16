import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { ContactService } from 'src/app/core/services/contact.service';
import { RolService } from 'src/app/core/services/rol.service';
import { ContactServiceModel } from 'src/app/models/contactService.model';
import { responseService } from 'src/app/models/responseService.model';

@Component({
  selector: 'app-new-contact',
  templateUrl: './new-contact.component.html',
  styleUrls: ['./new-contact.component.css'],
  
})
export class NewContactComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<NewContactComponent>, private rol : RolService
  ,private contacto : ContactService, private fb :FormBuilder , private fb2 :FormBuilder, private ruta : Router, private contactService : ContactService) { }
  seleccionar : number=0;
  contactoModel = new ContactServiceModel();
  labelAsignar : string = ""
  labelAgregar : string = ""
  selectService : boolean = false
  selectContacto : boolean = false

  url = this.ruta.url.split("/")[4]
  agregarForm : FormGroup = this.fb.group({
    nombre: [this.data.nombre ? this.data.nombre: '', Validators.required],
    paterno: [this.data.apPaterno ?this.data.apPaterno: '', Validators.required],
    materno: [this.data.apMaterno ? this.data.apMaterno: '', Validators.required],
    estatus: [this.data.estatus  != 0? this.data.estatus : '', Validators.required],
    cveRol: [this.data.idRol  != 0? this.data.idRol : '', Validators.required],
    telefono: [this.data.telefono ? this.data.telefono : '', Validators.required],
    celular: [this.data.celular ? this.data.celular : '', Validators.required],
    puesto: [this.data.puesto ? this.data.puesto: '', Validators.required],
    cveServicio: [this.data.idServicio != 0? this.data.idServicio : '', Validators.required],
    correo: [this.data.correo ? this.data.correo: '', Validators.required],
    contrasena: [this.data.contrasena? this.data.contrasena: '', Validators.required],
  })

  asignarForm : FormGroup = this.fb2.group({
    cveContacto: ["", Validators.required],
    cveServicio: ["", Validators.required] 
  })

  ngOnInit(): void {    
    this.editarTab()    
    if(this.url == "contact" ){
      this.selectContacto = true
      this.selectService = false
    }else{
      this.selectService = true
    }
  }


  async enviar(){

    if( this.seleccionar== 0){
      this.contactoModel = this.agregarForm.value
      this.contactoModel.servicio = document.getElementById("selectServicio")?.innerText+"";;
      this.contactoModel.rol = document.getElementById("selectRol")?.innerText+"";;
      if(this.data.opc == false){
        if(this.agregarForm.valid !=false){
            this.contactoModel.cveContacto = Number(this.data.proximoID)+1;
           await lastValueFrom(this.contacto.insertServicios_tServicos(this.contactoModel))
          this.dialogRef.close(this.contactoModel)
        }else{
          alert("Por favor llene los campos");
        }
      }else{
          this.contactoModel.cveContacto = this.data.idContacto;
          await lastValueFrom(this.contacto.updateContacto_tServicio(this.contactoModel))
          this.dialogRef.close(this.contactoModel)
      }
    }else{
      this.contactoModel = this.asignarForm.value
      await lastValueFrom(this.contactService.insertarContacto_Servicio(this.contactoModel))
    }
  }

  seleccionado(selected : number){
    this.seleccionar = selected;
    
  }

  editarTab() {
    if(this.data.opcTab){
      this.labelAgregar = "Editar contacto"
  
    }else{
      this.labelAgregar = "Agregar Contacto y servicio"
      this.labelAsignar = "Asignar contacto a servicio"

     this.agregarForm  = this.fb.group({
        nombre: [ '', Validators.required],
        paterno: [ '', Validators.required],
        materno: [ '', Validators.required],
        estatus: [ '', Validators.required],
        cveRol: [ '', Validators.required],
        telefono: [ '', Validators.required],
        celular: [ '', Validators.required],
        puesto: [ '', Validators.required],
        cveServicio: [this.data.idServicioDefault , Validators.required],
        correo: ['', Validators.required],
        contrasena: [ '', Validators.required],
      })

      this.asignarForm = this.fb2.group({
        cveContacto: ["", Validators.required],
        cveServicio: this.data.idServicioDefault  
      })
    }
  }


  todosContactos(idServicio : number){
    this.contactService.llamar_Contactos_OnlyServicio(this.data.idCliente,idServicio,4).subscribe((resp:responseService)=>{
      this.data.arrayContactos = resp.container
      this.selectContacto = false
    })
  }
}
