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
  selector: 'app-new-radio',
  templateUrl: './new-radio.component.html',
  styleUrls: ['./new-radio.component.css']
})
export class NewRadioComponent implements OnInit {
  cveRepetidor : number =0
  segmentos : any []= [] ;
  usuarios : any [] = [];
  repetidoras : any [] =[];
  ips : any [] = [];
  newModel = new DeviceModel()
  $sub = new Subscription()
  saveId : number =0;
  radioForm : FormGroup  = this.fb.group({
    nombre: [this.data.model.device ? this.data.model.device : '', Validators.required],
    idEstatus: [this.data.model.idEstatus !=0 ? this.data.model.idEstatus : '' , Validators.required],
    idTipo: [this.data.model.idTipo !=0 ? this.data.model.idTipo : '', Validators.required],
    idRepetidora: [this.data.model.idRepetidora !=0 ? this.data.model.idRepetidora : '', Validators.required],
    modelo: [this.data.model.modelo  ? this.data.model.modelo : '', Validators.required],
    idSegmento: [this.data.model.idSegmento != 0 ? this.data.model.idSegmento : '', Validators.required],
    idIp: [this.data.model.idIp != 0? this.data.model.idIp : '', Validators.required],
    idUsuario: [this.data.model.idUsuario !=0 ? this.data.model.idUsuario : '', Validators.required],
    contrasena: [this.data.model.contrasena ? this.data.model.contrasena : '', Validators.required],
    snmp: [this.data.model.snmp ? this.data.model.snmp : '', Validators.required]
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private servicioRepetidora : RepeaterService,private ipService : IpService,
  private segmentoService : RepeaterService, private userService : UsuarioService,private fb:FormBuilder, public dialogRef: MatDialogRef<NewRadioComponent>) {
    this.inicio();
    console.log(this.radioForm.value);
    
   }

  ngOnInit(): void {   

   
  }

  //cargando insertar o editar async
  async inicio(){
   await  this.todasRepetidoras();
   await this.todosUsuarios();

    if(this.data.opc == true){ 
      this.$sub.add (await this.segmentoService.buscarSegmentoRepetidor(this.data.model.idRepetidora).subscribe((resp:responseService)=>{
        this.segmentos = resp.container;        
    }));
      let arraySegmento :string[] = this.data.model.segmento.split("-")
      this.$sub.add (await this.ipService.selectIp(arraySegmento[0].trim(), arraySegmento[1].trim()).subscribe((resp:responseService)=>{
        this.ips = resp.container
        
      }))
    }else{
      this.saveId = this.data.model.idDevice;
      this.radioForm = this.fb.group({
        nombre: ['', Validators.required],
        idEstatus: ['' , Validators.required],
        idTipo: ['', Validators.required],
        idRepetidora: ['', Validators.required],
        modelo: ['', Validators.required],
        idSegmento: ['', Validators.required],
        idIp:  ['', Validators.required],
        idUsuario: ['', Validators.required],
        contrasena: ['', Validators.required],
        snmp:  ['', Validators.required]
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
        console.log(this.segmentos);
        
    }));
  }


  //enviar y editar  form

  enviar(){
    this.data.salir = false
    this.newModel.contrasena =this.radioForm.value.contrasena;
    this.newModel.estatus =  document.getElementById("estatus")?.innerText+"";
    this.newModel.idEstatus = this.radioForm.value.idEstatus
    this.newModel.idIp = this.radioForm.value.idIp
    this.newModel.idDevice = this.data.idDevice;
    this.newModel.idRepetidora = this.radioForm.value.idRepetidora
    this.newModel.idSegmento = this.radioForm.value.idSegmento
    this.newModel.idTipo = this.radioForm.value.idTipo
    this.newModel.idUsuario = this.radioForm.value.idUsuario
    this.newModel.ip =  document.getElementById("ip")?.innerText+""
    this.newModel.modelo = this.radioForm.value.modelo
    this.newModel.device = this.radioForm.value.nombre
    this.newModel.repetidora = document.getElementById("repetidora")?.innerText+""
    this.newModel.segmento = document.getElementById("segmento")?.innerText+""
    this.newModel.snmp = this.radioForm.value.snmp
    this.newModel.tipo =  document.getElementById("tipo")?.innerText+""
    this.newModel.usuario = document.getElementById("usuario")?.innerText+""
    console.log(this.newModel);
    
    if(this.radioForm.valid == false){
      alert("Por favor llene todos los campos")
    }else{
      if(this.data.opc == false){
        this.newModel.idDevice =  (Number(this.saveId) +1);
        this.dialogRef.close(this.newModel)
      }else{        
        this.newModel.idDevice = this.data.model.idDevice;
        console.log(this.newModel);
        
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
