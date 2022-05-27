import { Component, ComponentRef, ElementRef, Inject, OnInit, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { lastValueFrom, Subscription } from 'rxjs';
import { IpService } from 'src/app/core/services/ip.service';
import { RepeaterService } from 'src/app/core/services/repeater.service';
import { DeviceModel } from 'src/app/models/device.model';
import { responseService } from 'src/app/models/responseService.model';
import { UsuarioService } from 'src/app/core/services/user.service';
import { DeviceService } from 'src/app/core/services/device.service';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatSelect } from '@angular/material/select';


@Component({
  selector: 'app-new-equipament',
  templateUrl: './new-equipament.component.html',
  styleUrls: ['./new-equipament.component.css']
})
export class NewEquipamentComponent implements OnInit {
  routerForm : FormGroup  = this.fb.group({
    device: [this.data.model.device ? this.data.model.device : '', Validators.required],
    idEstatus: [this.data.model.idEstatus !=0 ? this.data.model.idEstatus : '' , Validators.required],
    idTipo: [this.data.model.idTipo !=0 ? this.data.model.idTipo : '', Validators.required],
    idRepetidora: [this.data.model.idRepetidora !=0? this.data.model.idRepetidora : '', Validators.required],
    comentario: [this.data.model.comentario ? this.data.model.comentario : '', Validators.required],
    modelo: [this.data.model.modelo  ? this.data.model.modelo : '', Validators.required],
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
  idAuto : number =0;
  gIp2 : number=0;
  valorSegmento : number =0
  
  IpSeleccionadas : Array<number[]>= []
  guardandoPrimerIndice : Array<number> = [] 
  primerIndice : number = 0
  @ViewChild('placeholder', {read: ViewContainerRef, static: true}) placeholder: ViewContainerRef;
  @ViewChild('ip') ip : MatSelect | undefined; 
  @ViewChild('segmento') segmento : MatSelect | undefined; 

  matCheckboxMap : any = {};
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private servicioRepetidora : RepeaterService,private ipService : IpService
  ,private fb:FormBuilder,private segmentoService : RepeaterService, private userService : UsuarioService, public dialogRef: MatDialogRef<NewEquipamentComponent>,
  private deviceService : DeviceService,private _renderer: Renderer2, private fbBox : FormBuilder, private viewC:ViewContainerRef) { 
      this.placeholder = viewC
  }
  
  ngOnInit(): void {
    this.inicio();
    this.idMax();  
    this.placeholder.clear();
  }
  async idMax(){
    this.deviceService.idMaxOther().subscribe((resp:responseService)=>{
      this.idAuto=  resp.container[0].max;
    })
  }
  async inicio(){
    await  this.todasRepetidoras();
    await this.todosUsuarios();
    
     if(this.data.opc == true){     
     await this.$sub.add (await this.segmentoService.buscarSegmentoRepetidor(this.data.model.idRepetidora).subscribe((resp:responseService)=>{
         this.segmentos = resp.container;
         
     }));
     
       let arraySegmento :string[] = this.data.model.segmento.split("-")  
      await this.$sub.add (await this.ipService.selectIp(arraySegmento[0], arraySegmento[1]).subscribe((resp:responseService)=>{
         this.ips = resp.container;
         
       }))
     }else{
       this.routerForm = this.fb.group({
        device: [ '', Validators.required],
        idEstatus: ['' , Validators.required],
        idTipo: [ '', Validators.required],
        idRepetidora: ['', Validators.required],
        comentario: ['', Validators.required],
        modelo: ['', Validators.required],
        idUsuario: [ '', Validators.required],
        contrasena: ['', Validators.required],
        snmp: ['', Validators.required]
       });
 
     }
   }
 //Metodos en el DOM
 tabChangeSegmento(){  
   this.primerIndice = this.segmento?.value
   let arraySegmento :string  []= (this.segmento?._selectionModel.selected[0].viewValue?this.segmento?._selectionModel.selected[0].viewValue:"").split("-") 
  if(this.guardandoPrimerIndice.indexOf(this.primerIndice) == -1){
    this.$sub.add(this.ipService.selectIp(arraySegmento[0], arraySegmento[1]).subscribe((resp:responseService)=>{
      this.ips = resp.container
    }))
  }else{
  this.$sub.add (this.ipService.selectIp(arraySegmento[0], arraySegmento[1],this.IpSeleccionadas[this.guardandoPrimerIndice.indexOf(this.primerIndice)].toString()).subscribe((resp:responseService)=>{
    this.ips = resp.container
  }))
  }

}

tabChangeRepetidora(rep : number){       
  this.valorSegmento = -1 
  this.$sub.add(this.segmentoService.buscarSegmentoRepetidor(rep).subscribe((resp:responseService)=>{
      this.segmentos = resp.container;
      this.primerIndice = this.segmentos.length;
      this.ips = []

  }));
  }

//enviar y editar  form
enviar(){
  this.data.salir = false;
  this.newModel  = this.routerForm.value
  this.newModel.estatus =  document.getElementById("estatus")?.innerText+"";
  this.newModel.ip =  document.getElementById("ip")?.innerText+""
  this.newModel.idIp2 = this.IpSeleccionadas
 // this.newModel.ip2 =  document.getElementById("ip2")?.innerText+""
  this.newModel.repetidora = document.getElementById("repetidora")?.innerText+""
  this.newModel.segmento = document.getElementById("segmento")?.innerText+""
  this.newModel.tipo =  document.getElementById("tipo")?.innerText+""
  this.newModel.usuario = document.getElementById("usuario")?.innerText+""
       
  if(this.routerForm.valid == false){
    alert("Por favor llene todos los campos")
  }else{
    if(this.data.opc == false){
      this.newModel.idDevice =  this.idAuto;
      this.dialogRef.close(this.newModel)
      lastValueFrom(this.deviceService.insertarOtros(this.newModel))
    }else{        
      this.newModel.idDevice = this.data.model.idDevice;            
      this.dialogRef.close(this.newModel)
      lastValueFrom(this.deviceService.actualizarotros(this.newModel))
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

  async guardarIp(num: number){
    if(this.guardandoPrimerIndice.indexOf(this.primerIndice) == -1){     
      this.guardandoPrimerIndice.push(this.primerIndice)
      this.IpSeleccionadas.push([num])
    }else{  
      this.IpSeleccionadas[this.guardandoPrimerIndice.indexOf(this.primerIndice)].push(num)
    }
    this.createComponent({ title: this.ip?._selectionModel.selected[0].viewValue?this.ip?._selectionModel.selected[0].viewValue:"", id: num.toString(), state: true, index:this.guardandoPrimerIndice.indexOf(this.primerIndice)})

  }

   createComponent(input: { title: string, id: string, state: boolean, index:number }) {
    let titleElm = this._renderer.createText(input.title);
    let ref = this.placeholder?.createComponent(MatCheckbox)
    ref.instance.id = input.id ;
    ref.instance.checked = input.state;
    ref.instance.color = "primary"
    let elm = ref.location.nativeElement as HTMLElement | any;
    this._renderer.listen(elm, 'click', (event:boolean) => { this.destruirCheckbox(ref,Number(input.id),input.index)});
    elm.firstChild.lastChild.appendChild(titleElm);
    this._renderer.addClass(elm, 'mat-checkbox')
    ref.changeDetectorRef.detectChanges();
    ref.instance.change.subscribe(val => this.matCheckboxMap[input.id] = val.checked);
  }

  destruirCheckbox(event:ComponentRef<MatCheckbox>,id:number,index:number){
   this.IpSeleccionadas[index].splice(this.IpSeleccionadas[index].indexOf(id), 1);   
   event.destroy()
  }

  ngAfterContentInit(): void {

  }
    checkboxes(){
    }



}
