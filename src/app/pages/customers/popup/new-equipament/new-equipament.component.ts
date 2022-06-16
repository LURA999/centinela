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
import { Router } from '@angular/router';


@Component({
  selector: 'app-new-equipament',
  templateUrl: './new-equipament.component.html',
  styleUrls: ['./new-equipament.component.css']
})
export class NewEquipamentComponent implements OnInit {
  routerForm : FormGroup  = this.fb.group({
    device: [this.data.model.device ? this.data.model.device : '', Validators.required],
    idEstatus: [this.data.model.idEstatus !=0 ? this.data.model.idEstatus : '' , Validators.required],
    comentario: [this.data.model.comentario ? this.data.model.comentario : '', Validators.required],
    modelo: [this.data.model.modelo  ? this.data.model.modelo : '', Validators.required],
    idUsuario: [this.data.model.idUsuario !=0 ? this.data.model.idUsuario : '', Validators.required],
    idRepetidora  : [this.data.model.idRepetidora !=0 ? this.data.model.idRepetidora : '', Validators.required],
    contrasena: [this.data.model.contrasena ? this.data.model.contrasena : '', Validators.required],
    snmp: [this.data.model.snmp ? this.data.model.snmp : '', Validators.required]
  });
hide=true;
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
  ipsGuardadas : any [] =[]
  cadenaDeIps : string =""

  IpSeleccionadas : Array<number[]>= []
  guardandoindicesSegmentos : Array<number> = [] 
  indicesSegmentos : number = 0
  identificador :string = this.ruta.url.split("/")[4].replace(/([0-9]{4})\S/,"");
  contadorIdenti :string = this.ruta.url.split("/")[4].replace(/[0-9]*[A-Za-z]/,"");

  @ViewChild('placeholder', {read: ViewContainerRef, static: true}) placeholder!: ViewContainerRef;
  @ViewChild('ip') ip! : MatSelect; 
  @ViewChild('segmento') segmento! : MatSelect ; 
  @ViewChild('repetidora') repetidora! : MatSelect ; 

  
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private servicioRepetidora : RepeaterService,private ipService : IpService
  ,private fb:FormBuilder,private segmentoService : RepeaterService, private userService : UsuarioService, public dialogRef: MatDialogRef<NewEquipamentComponent>,
  private deviceService : DeviceService,private _renderer: Renderer2,private ruta : Router) { 
    
  }
  
  ngOnInit(): void {    
    this.placeholder.clear();
    this.inicio();
    this.idMax();  
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
      this.$sub.add ( this.segmentoService.buscarSegmentoRepetidor(this.data.model.idRepetidora).subscribe((resp:responseService)=>{
         this.segmentos = resp.container;
         
     }));
    
     }else{
       this.routerForm = this.fb.group({
        device: [ '', Validators.required],
        idEstatus: ['' , Validators.required],
        comentario: ['', Validators.required],
        modelo: ['', Validators.required],
        idUsuario: [ '', Validators.required],
        idRepetidora: [ '', Validators.required],
        contrasena: ['', Validators.required],
        snmp: ['', Validators.required]
       });
 
     }
   }
 //Metodos en el DOM
 tabChangeSegmento(){  
  this.ip.value=-1
  this.indicesSegmentos = this.segmento?.value
  try {
  let arraySegmento :string  []= (this.segmento?._selectionModel.selected[0].viewValue?this.segmento?._selectionModel.selected[0].viewValue:"").split("-") 
  //entrara en el if, si el segmento jamas ha sido seleccionado, de lo contrario entra al else
    if(this.guardandoindicesSegmentos.indexOf(this.indicesSegmentos) == -1  ){
    this.$sub.add(this.ipService.selectIp(arraySegmento[0], arraySegmento[1]).subscribe((resp:responseService)=>{
    this.ips = resp.container
  }))
  }else{
    //Si el array de ips esta vacio, se vuelve a llenar
    if(this.IpSeleccionadas[this.guardandoindicesSegmentos.indexOf(this.indicesSegmentos)].length ==0){
      //Se resetea tanto las ips seleccionadas como los segmentos que contenian dichas ips
      this.$sub.add(this.ipService.selectIp(arraySegmento[0], arraySegmento[1]).subscribe(async (resp:responseService)=>{
        if(this.data.opc == true && this.ipsGuardadas.length > 0){
          let nuevoArray : any []=[];
          for await (const x of this.ipsGuardadas) {
            if(x.segmento === arraySegmento[0] + "-" + arraySegmento[1]){
              nuevoArray.push(x)
            }            
          }
          let jsnIpsG =JSON.stringify(nuevoArray);
          let jsnResp = JSON.stringify(resp.container);
          jsnIpsG = jsnIpsG.replace(jsnIpsG=="[]"?"[]":"]", ""); 
          jsnResp = jsnResp.replace("[",(jsnIpsG==""?"[":","));
          this.ips = JSON.parse(jsnIpsG+jsnResp)            
        }else{
          this.ips = resp.container
        }
      }))
      
    }else{ 
      this.$sub.add (this.ipService.selectIp(arraySegmento[0], arraySegmento[1],this.IpSeleccionadas[this.guardandoindicesSegmentos.indexOf(this.indicesSegmentos)].toString()).subscribe(async (resp:responseService)=>{
        if(this.data.opc == true && this.ipsGuardadas.length > 0){
          let nuevoArray:any []= []; 
          for await (const x of this.ipsGuardadas) {
            if(x.segmento === arraySegmento[0] + "-" + arraySegmento[1]){
              nuevoArray.push(x)
            }
          }          
          let jsnIpsG =JSON.stringify(nuevoArray);
          let jsnResp = JSON.stringify(resp.container);
          jsnIpsG = jsnIpsG.replace(jsnIpsG=="[]"?"[]":"]", ""); 
          jsnResp = jsnResp.replace("[",(jsnIpsG==""?"[":","));
          this.ips = JSON.parse(jsnIpsG+jsnResp)    
        }else{
          this.ips = resp.container
        }   
      }))  
    }
  }
  }catch(Exception){  }
}

tabChangeRepetidora(rep : number){       
  this.segmento.value = -1
    let arrayString= this.IpSeleccionadas.toString().replace(/\,/gi,"");
    if(arrayString === ''){
    this.$sub.add (this.segmentoService.buscarSegmentoRepetidor(rep).subscribe((resp:responseService)=>{
      this.segmentos = resp.container;      
      this.indicesSegmentos = this.segmentos.length;
      this.ips = []
      this.IpSeleccionadas=[]
    }));
    }else{
      alert("No puede mezclar segmentos de otra repetidora")
      this.repetidora.value = this.data.model.idRepetidora
      this.ip.value = -1
    }
  }

//enviar y editar  form
enviar(){  
  if(this.cadenaDeIps.split(",").length >1  || this.cadenaDeIps.split(",").length ==1 && this.cadenaDeIps.split(",")[0] !== "" ){
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
      lastValueFrom(this.deviceService.insertarOtros(this.newModel))

      this.dialogRef.close(this.newModel)
    }else{        
      this.newModel.idDevice = this.data.model.idDevice;
      lastValueFrom(this.deviceService.actualizarotros(this.newModel))
            
      this.dialogRef.close(this.newModel)      
    }
  }
  }else{
    alert("El dispositivo debe de tener por lo menos una ip");
  }
  
}

  //Peticiones
  async todasRepetidoras() {
    this.$sub.add(this.servicioRepetidora.llamarRepitdores().subscribe((resp:responseService)=>{
      this.repetidoras = resp.container
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

  async guardarIp(num: number, primeraOp: number, ip? : string,event?:any,boxIdSegmento?:number){
        
    if(boxIdSegmento != undefined){
      //se ejecuta cuando estas editando y no has elegido manualmente un segmento
      this.indicesSegmentos = boxIdSegmento;
    }
    if(this.guardandoindicesSegmentos.indexOf(this.indicesSegmentos) == -1){     
      //se crea un espacio para el id del segmento que se selecciono, y en ese espacio se guarda el ip seleccionado del respecitvo segmento
      this.guardandoindicesSegmentos.push(this.indicesSegmentos)
      this.IpSeleccionadas.push([num])
    }else{  
      //busca en donde se encuentra el id del segmento, para guardar  MAS ips 
      this.IpSeleccionadas[this.guardandoindicesSegmentos.indexOf(this.indicesSegmentos)].push(num)
    }

    this.cadenaDeIps = JSON.stringify(this.IpSeleccionadas).replace(/\]/gi,"").replace(/\[/gi,"").replace(/\"/gi,"");

    /**title: el texto del select, id: el id del IP,
     * state_checkbox: 1  cuando es de select a checkbox y 2 es para inyectarlo directo al checkbox (cuando editas),
     * index: indice del array (segmentos)  en donde se encuentra el segmento */
    switch(primeraOp)
    {
      case 1:
        this.createComponent(
          { title: this.ip?._selectionModel.selected[0].viewValue?this.ip?._selectionModel.selected[0].viewValue:"", id: num.toString(),
           state: true, index:this.guardandoindicesSegmentos.indexOf(this.indicesSegmentos) },event.source._keyManager._activeItem
          )
        break;
      case 2:
        this.createComponent(
          { title: ip?ip:"", id: num.toString(),
            state: true, index:this.guardandoindicesSegmentos.indexOf(this.indicesSegmentos) }, event
          )
        break;
    }
  }
  
  elementOption(event:any){
    event._disabled = true
    this._renderer.setAttribute(event._element.nativeElement,"hidden","true")
  }

   createComponent(input: { title: string, id: string, state: boolean, index:number },_event? : any) {
    this.data.model.idRepetidora  = this.routerForm.value.idRepetidora;
    let titleElm = this._renderer.createText(input.title);
    let ref = this.placeholder?.createComponent(MatCheckbox)
    ref.instance.id = input.id ;
    ref.instance.checked = input.state;
    ref.instance.color = "primary"
    let elm = ref.location.nativeElement as HTMLElement | any;  
    this._renderer.listen(elm, 'click', (event:any) => { this.destruirCheckbox(ref,Number(input.id),input.index,_event)});
    this._renderer.listen(elm, 'keydown', (event:any) => { this.destruirCheckbox(ref,Number(input.id),input.index,_event)});
    elm.firstChild.lastChild.appendChild(titleElm);
    this._renderer.addClass(elm, 'mat-checkbox')
    ref.changeDetectorRef.detectChanges();
    //ref.instance.change.subscribe(val => this.matCheckboxMap[input.id] = val.checked);
  }

  //Se destruye de la vista y del array donde se tiene guardado las ips  de manera local (no BD)
  destruirCheckbox(event:ComponentRef<MatCheckbox>,id:number,index:number, box:any){
   
    if(box.id !== undefined){
      box._disabled = false;
      box._selected = false;
      this._renderer.removeAttribute(box._element.nativeElement,"hidden")
    }else{
      this.ipsGuardadas.unshift(box)
      this.tabChangeSegmento();
    }
    let array = this.IpSeleccionadas[index].toString().split(",");
    this.IpSeleccionadas[index].splice(array.indexOf(id.toString()),1);
    event.destroy()
    this.cadenaDeIps = JSON.stringify(this.IpSeleccionadas).replace(/\]/gi,"").replace(/\[/gi,"").replace(/\"/gi,"").replace(/([,]+)*/,"");     
    this.cadenaDeIps = this.cadenaDeIps.replace(/[,][,]/,",");
    if((this.cadenaDeIps[this.cadenaDeIps.length-1] === "," ? true : false) === true) 
    {
      this.cadenaDeIps=this.cadenaDeIps.substring(0, this.cadenaDeIps.length - 1);
    }
  
  }


  ngAfterViewInit(): void { 
    if (this.data.opc == true) {
      this.ipsEditar(this.data.model.idDevice)  
    } 
  }

  /**Este te trae todas las ips de un dispositivo, se usara cuando le piques a editar */
  async ipsEditar(id:number){    
    this.ipService.selectIpOneEquipament(id, this.identificador, 2, Number(this.contadorIdenti)).subscribe(async (resp: responseService) => {
      let ip: any = resp.container;          
      for await (let y of ip){
       this.indicesSegmentos= y.idSegmento
        this.guardarIp(y.idIp,2,y.ip,y);
      }
      this.cadenaDeIps = JSON.stringify(this.IpSeleccionadas).replace(/\]/gi,"").replace(/\[/gi,"").replace(/\"/gi,""); 
    })
  }
}
