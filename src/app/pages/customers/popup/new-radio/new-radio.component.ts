import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { lastValueFrom, Subscription } from 'rxjs';
import { DeviceService } from 'src/app/core/services/device.service';
import { IpService } from 'src/app/core/services/ip.service';
import { RepeaterService } from 'src/app/core/services/repeater.service';
import { UsuarioService } from 'src/app/core/services/user.service';
import { DeviceModel } from 'src/app/models/device.model';
import { responseService } from 'src/app/models/responseService.model';

@Component({
  selector: 'app-new-radio',
  templateUrl: './new-radio.component.html',
  styleUrls: ['./new-radio.component.css']
})
export class NewRadioComponent implements OnInit {
  cveRepetidor : number =0
  segmentos : any []= [] ;
  usuarios : any [] = [];
  repetidoras : any [] =[];
  idAuto : number =0;
  ips : any [] = [];
  tipo : number =0
  newModel = new DeviceModel()
  identificador :string = this.ruta.url.split("/")[4];
  $sub = new Subscription()
  radioForm : FormGroup  = this.fb.group({
    device: [this.data.model.device ? this.data.model.device : '', Validators.required],
    idEstatus: [this.data.model.idEstatus !=0 ? this.data.model.idEstatus : '' , Validators.required],
    idTipo: [this.data.model.idTipo !=0 ? this.data.model.idTipo : '', Validators.required],
    comentario: [this.data.model.comentario ? this.data.model.comentario : '', Validators.required],
    idRepetidora: [this.data.model.idRepetidora !=0 ? this.data.model.idRepetidora : '', Validators.required],
    modelo: [this.data.model.modelo  ? this.data.model.modelo : '', Validators.required],
    idSegmento: [this.data.model.idSegmento != 0 ? this.data.model.idSegmento : '', Validators.required],
    idIp: [this.data.model.idIp != 0? this.data.model.idIp : '', Validators.required],
    idUsuario: [this.data.model.idUsuario !=0 ? this.data.model.idUsuario : '', Validators.required],
    contrasena: [this.data.model.contrasena ? this.data.model.contrasena : '', Validators.required],
    snmp: [this.data.model.snmp ? this.data.model.snmp : '', Validators.required]
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private servicioRepetidora : RepeaterService,private ipService : IpService,
  private segmentoService : RepeaterService, private userService : UsuarioService,private fb:FormBuilder, public dialogRef: MatDialogRef<NewRadioComponent>
  ,private deviceService : DeviceService, private ruta : Router) { }

  ngOnInit(): void {   
    this.inicio();
    this.idMax();
  }

  async idMax(){
    this.deviceService.idMaxRadio().subscribe((resp:responseService)=>{
      this.idAuto=  resp.container[0].max;
    })
  }
  
  //cargando insertar o editar async
  async inicio() {
    
   await this.todosUsuarios();

    if(this.data.opc == true){ 
      await this.todasRepetidoras(this.data.model.idTipo)

      this.$sub.add(this.segmentoService.buscarSegmentoRepetidorTipo(this.data.model.idRepetidora,this.data.model.idTipo).subscribe((resp:responseService)=>{
        this.segmentos = resp.container;                
    }));

      let arraySegmento :string[] = this.data.model.segmento.split("-")
      this.$sub.add(this.ipService.selectIp(arraySegmento[0], arraySegmento[1]).subscribe((resp:responseService)=>{
        this.ips = resp.container
      }))

    }else{
      this.radioForm = this.fb.group({
        device: ['', Validators.required],
        idEstatus: ['' , Validators.required],
        idTipo: ['', Validators.required],
        idRepetidora: ['', Validators.required],
        modelo: ['', Validators.required],
        idSegmento: ['', Validators.required],
        idIp:  ['', Validators.required],
        idUsuario: ['', Validators.required],
        contrasena: ['', Validators.required],
        snmp:  ['', Validators.required],
        comentario : ['', Validators.required]
      });

    }
  }

//Metodos en el DOM
  tabChangeSegmento(){    
    let segmento : string= document.getElementById("segmento")?.innerText+""; 
    let arraySegmento :string[] =segmento.split("-")
    this.$sub.add (this.ipService.selectIp(arraySegmento[0], arraySegmento[1]).subscribe((resp:responseService)=>{
      this.ips = resp.container
    }))
  }

  tabChangeRepetidora(rep : number,tipo : number){           
    this.$sub.add (this.segmentoService.buscarSegmentoRepetidorTipo(rep,tipo).subscribe((resp:responseService)=>{
        this.segmentos = resp.container;
        this.ips = []        
    }));
  }

  //enviar y editar  form
  enviar(){
   this.data.salir = false
   this.newModel = this.radioForm.value
   this.newModel.estatus =  document.getElementById("estatus")?.innerText+"";
   this.newModel.ip =  document.getElementById("ip")?.innerText+""
   this.newModel.repetidora = document.getElementById("repetidora")?.innerText+""
   this.newModel.segmento = document.getElementById("segmento")?.innerText+""
   this.newModel.tipo =  document.getElementById("tipo")?.innerText+""
   this.newModel.usuario = document.getElementById("usuario")?.innerText+""
   this.newModel.contador = Number(this.identificador.slice(2,7))
   this.newModel.identificador = this.identificador.slice(0,2)
    
    if(this.radioForm.valid == false){
      alert("Por favor llene todos los campos")
    }else{
      if(this.data.opc == false){
        this.newModel.idDevice =  this.idAuto;
        this.dialogRef.close(this.newModel)     
        lastValueFrom(this.deviceService.insertarRadio(this.newModel))
      }else{        
        this.newModel.idDevice = this.data.model.idDevice;        
        this.dialogRef.close(this.newModel)  
        lastValueFrom(this.deviceService.actualizarRadio(this.newModel))
      }
    }
  }

  //Peticiones
  async todasRepetidoras(tipo:number) {
    this.$sub.add(this.servicioRepetidora.llamarRepitdoresTipo(tipo).subscribe((resp:responseService)=>{
      this.repetidoras = resp.container
      this.tipo = tipo
    }));
  }

  async todosUsuarios(){
    this.$sub.add(this.userService.todosUsuarios().subscribe((resp:responseService)=>{
      this.usuarios = resp.container      
    }))
  }

  ngOnDestroy(): void {
    this.$sub.unsubscribe();
  }
}
