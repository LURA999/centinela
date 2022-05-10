import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { IpService } from 'src/app/core/services/ip.service';
import { RepeaterService } from 'src/app/core/services/repeater.service';
import { UsuarioService } from 'src/app/core/services/user.service';
import { DeviceModel } from 'src/app/models/device.model';
import { responseService } from 'src/app/models/responseService.model';

@Component({
  selector: 'app-new-equipament',
  templateUrl: './new-equipament.component.html',
  styleUrls: ['./new-equipament.component.css']
})
export class NewEquipamentComponent implements OnInit {
  routerForm : FormGroup  = this.fb.group({
    nombre: [this.data.model.device ? this.data.model.device : '', Validators.required],
    estatus: [this.data.model.idEstatus !=0 ? this.data.model.idEstatus : '' , Validators.required],
    idTipo: [this.data.model.idTipo !=0 ? this.data.model.idTipo : '', Validators.required],
    idRepetidora: [this.data.model.idRepetidora !=0? this.data.model.idRepetidora : '', Validators.required],
    comentario: [this.data.model.comentario ? this.data.model.comentario : '', Validators.required],
    modelo: [this.data.model.modelo  ? this.data.model.modelo : '', Validators.required],
    idSegmento: [this.data.model.idSegmento != 0 ? this.data.model.idSegmento : '', Validators.required],
    idIp: [this.data.model.idIp != 0? this.data.model.idIp : '', Validators.required],
    idIp2: [this.data.model.idIp2 != 0? this.data.model.idIp2 : '', Validators.required],
    idUsuario: [this.data.model.idUsuario !=0 ? this.data.model.idUsuario : '', Validators.required],
    contrasena: [this.data.model.contrasena ? this.data.model.contrasena : '', Validators.required],
    snmp: [this.data.model.snmp ? this.data.model.snmp : '', Validators.required]
  });
  saveId : number =0;
  newModel = new DeviceModel()
  $sub = new Subscription()
  usuarios : any [] = [];
  repetidoras : any [] =[];
  ips : any [] = [];
  cveRepetidor : number =0
  segmentos : any []= [] ;
    
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private servicioRepetidora : RepeaterService,private ipService : IpService
  ,private fb:FormBuilder,private segmentoService : RepeaterService, private userService : UsuarioService, public dialogRef: MatDialogRef<NewEquipamentComponent>) { 

  }
  
  ngOnInit(): void {
    this.inicio();
  
  }

  async inicio(){
    await  this.todasRepetidoras();
    await this.todosUsuarios();
    
     if(this.data.opc == true){     
     await this.$sub.add (await this.segmentoService.buscarSegmentoRepetidor(this.data.model.idRepetidora).subscribe((resp:responseService)=>{
         this.segmentos = resp.container;
         console.log(this.segmentos);
         
     }));
     
       let arraySegmento :string[] = this.data.model.segmento.split("-")  
      await this.$sub.add (await this.ipService.selectIp(arraySegmento[0].trim(), arraySegmento[1].trim()).subscribe((resp:responseService)=>{
         this.ips = resp.container
         console.log(this.ips);
         
       }))
     }else{
       this.saveId = this.data.model.idDevice;
       this.routerForm = this.fb.group({
        nombre: [ '', Validators.required],
        estatus: ['' , Validators.required],
        idTipo: [ '', Validators.required],
        idRepetidora: ['', Validators.required],
        comentario: ['', Validators.required],
        modelo: ['', Validators.required],
        idSegmento: ['', Validators.required],
        idIp: ['', Validators.required],
        idIp2: ['', Validators.required],
        idUsuario: [ '', Validators.required],
        contrasena: ['', Validators.required],
        snmp: ['', Validators.required]
       });
       this.data.model.idDevice = (Number(this.saveId) +1)
 
     }
   }
 //Metodos en el DOM
 tabChangeSegmento(){  
  let segmento : string= document.getElementById("segmento")?.innerText+""; 
  let arraySegmento :string[] =segmento.split("-")
  this.$sub.add (this.ipService.selectIp(arraySegmento[0].trim(), arraySegmento[1].trim()).subscribe((resp:responseService)=>{
    this.ips = resp.container
  }))

}

tabChangeRepetidora(rep : number){       
  this.$sub.add (this.segmentoService.buscarSegmentoRepetidor(rep).subscribe((resp:responseService)=>{
      this.segmentos = resp.container;
      this.ips = []
      
  }));

}

//enviar y editar  form
enviar(){
  this.data.salir = false;
  this.newModel.contrasena = this.routerForm.value.contrasena;
  this.newModel.estatus =  document.getElementById("estatus")?.innerText+"";
  this.newModel.idEstatus = this.routerForm.value.estatus
  this.newModel.idIp = this.routerForm.value.idIp
  this.newModel.idIp2 = this.routerForm.value.idIp2
  this.newModel.idDevice = this.data.idDevice;
  this.newModel.idRepetidora = this.routerForm.value.idRepetidora
  this.newModel.idSegmento = this.routerForm.value.idSegmento
  this.newModel.idTipo = this.routerForm.value.idTipo
  this.newModel.idUsuario = this.routerForm.value.idUsuario
  this.newModel.ip =  document.getElementById("ip")?.innerText+""
  this.newModel.ip2 =  document.getElementById("ip2")?.innerText+""
  this.newModel.modelo = this.routerForm.value.modelo
  this.newModel.device = this.routerForm.value.nombre
  this.newModel.repetidora = document.getElementById("repetidora")?.innerText+""
  this.newModel.segmento = document.getElementById("segmento")?.innerText+""
  this.newModel.snmp = this.routerForm.value.snmp
  this.newModel.tipo =  document.getElementById("tipo")?.innerText+""
  this.newModel.usuario = document.getElementById("usuario")?.innerText+""
  this.newModel.comentario = this.routerForm.value.comentario;
      
  if(this.routerForm.valid == false){
    alert("Por favor llene todos los campos")
  }else{
    if(this.data.opc == false){
      this.newModel.idDevice =  (Number(this.saveId) +1);
      this.dialogRef.close(this.newModel)
    }else{        
      this.newModel.idDevice = this.data.model.idDevice;      
      this.dialogRef.close(this.newModel)
    }
  }
  
}

//Peticiones
async todasRepetidoras() {
  this.$sub.add (await this.servicioRepetidora.llamarRepitdores().subscribe((resp:responseService)=>{
    this.repetidoras = resp.container
  }));
}
async todosUsuarios(){
  this.$sub.add ( await this.userService.todosUsuarios().subscribe((resp:responseService)=>{
    this.usuarios = resp.container
    
  }))
}

ngOnDestroy(): void {
  this.$sub.unsubscribe();
}
}
