import { Component, Inject, OnInit, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatRadioButton } from '@angular/material/radio';
import { lastValueFrom, map, Observable, startWith } from 'rxjs';
import { SearchService } from 'src/app/core/services/search.service';
import { responseService } from 'src/app/models/responseService.model';

export interface buscarNombres {
  id : number,
  nombre : string
}

@Component({
  selector: 'app-search-id',
  templateUrl: './search-id.component.html',
  styleUrls: ['./search-id.component.css']
})
export class SearchIdComponent implements OnInit {

  form : FormGroup = this.fb.group({
    empresa: '',
    razon: '',
    social: '',
  })  
  controlEmpresa =new FormControl("")
  controlServicio =new FormControl("")
  controlRazon =new FormControl("")

  filtradoEmpresa!: Observable<buscarNombres[]> ;
  filtradoServicio!: Observable<buscarNombres[]> ;
  filtradoRazon!: Observable<buscarNombres[]> ;

  opcionesEmpresa: any[] = [];
  opcionesServicio: any[] = [];
  opcionesRazon: any[] = [];
  datosServicio : buscarNombres | undefined;

  @ViewChild('placeholder', {read: ViewContainerRef, static: true}) placeholder!: ViewContainerRef;

  constructor(private fb :FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any, 
  public dialogRef: MatDialogRef<SearchIdComponent>, private _renderer : Renderer2, private serviceSearch:SearchService) { 

  }

  ngOnInit(): void {
  
  }
  
  createComponent(input: { title: string, id: string, state: boolean, index:number },_event? : any) {
    let titleElm = this._renderer.createText(input.title);
    let ref = this.placeholder?.createComponent(MatRadioButton)
    ref.instance.id = input.id ;
    ref.instance.checked = input.state;
    ref.instance.color = "primary"
    let elm = ref.location.nativeElement as HTMLElement | any;  
    elm.firstChild.lastChild.appendChild(titleElm);
    this._renderer.addClass(elm, 'mat-radiobutton')
    ref.changeDetectorRef.detectChanges();
  }

  //enviar el identificador ya seleccioanda en el checkbox
  enviarIdentificador(){
    if(this.form.value.social !== "" || this.form.value.razon !== "" || this.form.value.empresa !== "")
      {
        console.log(this.form.value);
        
        this.dialogRef.close({identificador:this.form.value.ns?this.form.value.ns:this.form.value.ns?this.form.value.ns:this.form.value.empresa})
      }else{
        alert("Por favor ingrese seleccione un identificador");
      }
  }

  //boton para buscar el identificador de los tres campos
  buscarIdentificador(){
    if(this.form.value.social !== "" || this.form.value.razon !== "" || this.form.value.empresa !== "")
      {
        console.log(this.form.value);
        
        this.dialogRef.close({identificador:this.form.value.ns?this.form.value.ns:this.form.value.ns?this.form.value.ns:this.form.value.empresa})
      }else{
        alert("Por favor ingrese seleccione un identificador");
      }
  }


  //input de nombre de empresa
  buscarEmpresa(palabra : string, event : any){
    this.auxBuscador(palabra,event,1);

  }

  empresaSeleccionada(opcion : string){

  }

  //input de nombre de razon social
  buscarRazon(palabra : string, event : any){
   this.auxBuscador(palabra,event,2);

  }

  razonSeleccionada(opcion : string){

  }

  //input de nombre de servicio
  buscarServicio(palabra : string, event : any){
    this.auxBuscador(palabra,event,3);
    
  }

  servicioSeleccionada(opcion : string){

  }

  async auxBuscador(palabra : string, event : any,condicion : number) {
    if(event.key !== "tab" && event.key !=="ArrowUp" && event.key !=="ArrowDown"
    && event.key !=="ArrowLeft" && event.key !=="ArrowRight" && event.key !=="Enter" 
    && palabra.length == 1  && palabra !== ""  ){
      await lastValueFrom(this.serviceSearch.buscarNombres(palabra,condicion)).then(async (resp : responseService)=>{
        switch(condicion){
          case 1:
            this.opcionesEmpresa = resp.container;        
            break;
          case 2:
            this.opcionesRazon = resp.container;
            break;
          case 3:
            this.opcionesServicio = resp.container; 
            break;
        }
       
      })
      switch(condicion){
        case 1:
          this.filtradoEmpresa = this.controlEmpresa.valueChanges.pipe(
            startWith(''),
            map(value => {
              const nombre = typeof value === 'string' ? value : value?.nombre;
             return nombre ? this._filterEmpresa(nombre as string) : this.opcionesEmpresa.slice();
            } )
            )
          break;
        case 2:
          this.filtradoRazon = this.controlRazon.valueChanges.pipe(
            startWith(''),
            map(value => {
              const nombre = typeof value === 'string' ? value : value?.nombre;
             return nombre ? this._filterRazon(nombre as string) : this.opcionesRazon.slice();
            } )
            )
          break;
        case 3:
          this.filtradoServicio = this.controlServicio.valueChanges.pipe(
            startWith(''),
            map(value => {
              const nombre = typeof value === 'string' ? value : value?.nombre;
             return nombre ? this._filterServicio(nombre as string) : this.opcionesServicio.slice();
            } )
            )
          break;
      }

    }

    
  }

  /*async complementoFiltrado(_filtradoOpciones : Observable<buscarNombres[]>, control : FormControl, opciones : any){    
    
    _filtradoOpciones = control.valueChanges.pipe(
      startWith(''),
      map(value => {
        const nombre = typeof value === 'string' ? value : value?.nombre;
       return nombre ? this._filter(nombre as string,opciones) : opciones.slice();
      } )
      )
    }*/

    private _filterEmpresa(value: string) :buscarNombres[] {
      const filterValue = value.toLowerCase();
      return this.opcionesEmpresa.filter(opcion => opcion.nombre.toLowerCase().includes(filterValue));
    }
    private _filterServicio(value: string) :buscarNombres[] {
      const filterValue = value.toLowerCase();
      return this.opcionesServicio.filter(opcion => opcion.nombre.toLowerCase().includes(filterValue));
    }
    private _filterRazon(value: string) :buscarNombres[] {
      const filterValue = value.toLowerCase();
      return this.opcionesRazon.filter(opcion => opcion.nombre.toLowerCase().includes(filterValue));
    }

    displayFn(user: string) : string {
      return user 
    }
}
