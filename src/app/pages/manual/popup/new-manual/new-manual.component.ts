import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { read } from 'fs';
import { lastValueFrom } from 'rxjs';
import { ManualService } from 'src/app/core/services/manual.service';
import { ManualModel } from 'src/app/models/manual.model';
interface asunto {
  value: number;
  viewValue: string;
}
@Component({
  selector: 'app-new-manual',
  templateUrl: './new-manual.component.html',
  styleUrls: ['./new-manual.component.css']
})
export class NewManualComponent implements OnInit {
  manualmodel=new ManualModel()
  asuntos: asunto[] = [
    {value: 1, viewValue: 'Ninguno'},
    {value: 2, viewValue: 'Configurar radios'},
    {value: 3, viewValue: 'Cambio de frecuencias'},
    {value: 4, viewValue: 'Tunel'},
    {value: 5, viewValue: 'VPN'},
  ];
  selectedAsunto = this.asuntos[0].value;
   archivo:string=""
  public files: any [] = [];
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private manualservice :ManualService
  ,private _snackBar: MatSnackBar, public dialogRef: MatDialogRef<NewManualComponent>) { }
  public lector: any [] = [];  
  public arr: File [] = []; 
  ids : number [] =[]
  ngOnInit(): void {
  /* let x =  localStorage.getItem('sesion')
let info = this.parseJwt(x!!)

console.log(info);
*/
  }





subir(cveAsunto:number){



  let date=  (new Date()).toLocaleDateString('en-US');
  var fecha=date.split("/",3)
  for(let i=0;i<this.files.length;i++){
  this.manualmodel.archivo=this.lector[i]
  this.manualmodel.nombre=this.files[i]["name"]
let type=this.files[i]["name"]

if(type.indexOf(".png")>=0){
  this.manualmodel.tipo=1

}else if(type.indexOf(".pdf")>=0) {
  this.manualmodel.tipo=2
  

}else if(type.indexOf(".gif")){
  this.manualmodel.tipo=1

}else if(type.indexOf(".jpg")){
  this.manualmodel.tipo=1

}else{
  this.manualmodel.tipo=3
}
  this.manualmodel.fecha=fecha[2]+"-"+fecha[1]+"-"+fecha[0]
  if(this.files[i]["size"]>9999999){
    let tamaño=this.files[i]["size"]/1000000
        this.manualmodel.tamano=tamaño.toFixed()+" MB"

  }else{
    let tamaño=this.files[i]["size"]/1000
    this.manualmodel.tamano=tamaño.toFixed()+" KB"
  }
  this.manualmodel.cveAsunto=cveAsunto
 
  lastValueFrom(this.manualservice.insertarManual(this.manualmodel));  



  }
  
}





input(evt:any){

  
  const target : DataTransfer = <DataTransfer>(evt.target);
  let i
for( i=0;target.files.length>i;i++){
  this.arr.push(target.files[i])
  console.log(this.arr);
  

  }
  this.onFileChange(this.arr)

  
  /*
     let formato= ""+target.files[0].name.split(".")[target.files[0].name.split(".").length-1];
    if(formato == "xlsm" formato == "xlsx"  formato == "xlsb" formato == "xlts" formato == "xltm" formato == "xls" formato == "xlam" formato == "xla"formato == "xlw" ){
      if(target.files.length !==1) throw new  alert('No puedes subir multiples archivos') ;
      const reader: FileReader= new FileReader();*/


}


  
  onFileChange(pFileList: File[]){
    
    this.files = pFileList;
    for(let i=0;i<pFileList.length;i++){
    let file=pFileList[i]
   
    const reader= new FileReader()
    reader.readAsDataURL(file);
    
    reader.onload = () => {
this.lector[i]=reader.result
        console.log(reader.result);
       
    }
   

  }
  
  }

  deleteFile(f:any){
    this.files = this.files.filter(function(w){ return w.name != f.name });
    this._snackBar.open("Successfully delete!", 'Close', {
      duration: 2000,
    });
  }

  parseJwt(token:string) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  }

}
