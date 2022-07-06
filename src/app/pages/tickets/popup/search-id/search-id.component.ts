import { Component, Inject, OnInit, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatRadioButton } from '@angular/material/radio';
import { Observable } from 'rxjs';

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

  filtradoEmpresa: Observable<string[]> | undefined;
  filtradoServicio: Observable<any[]> | undefined;
  filtradoRazon: Observable<any[]> | undefined;

  @ViewChild('placeholder', {read: ViewContainerRef, static: true}) placeholder!: ViewContainerRef;

  constructor(private fb :FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any, 
  public dialogRef: MatDialogRef<SearchIdComponent>, private _renderer : Renderer2) { 

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
  buscarEmpresa(palabra : string, event : Event){

  }
  empresaSeleccionada(opcion : string){

  }

  //input de nombre de razon social
  buscarRazon(palabra : string, event : Event){

  }
  razonSeleccionada(opcion : string){

  }

  //input de nombre de servicio
  buscarServicio(palabra : string, event : Event){

  }

  servicioSeleccionada(opcion : string){

  }
}
