import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgDialogAnimationService } from 'ng-dialog-animation';
import { ManualService } from 'src/app/core/services/manual.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { ManualModel } from 'src/app/models/manual.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MyCustomPaginatorIntl } from '../../MyCustomPaginatorIntl';
import { NewManualComponent } from '../../manual/popup/new-manual/new-manual.component';
import { EditManualComponent } from '../../manual/popup/edit-manual/edit-manual.component';
import { DeleteManualComponent } from '../../manual/popup/delete-manual/delete-manual.component';
import { RepeteadMethods } from '../../RepeteadMethods';
import JSPDF, { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';
import { log } from 'console';

@Component({
  selector: 'app-productor',
  templateUrl: './productor.component.html',
  styleUrls: ['./productor.component.css'],
  providers: [{provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl}]
})
export class ProductorComponent implements OnInit {


 
  user:string =""
  ELEMENT_DATA : any =[]
  ELEMENT_PRINT:any=[]
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  displayedColumns = ['id','nombre',"fecha","tipo",'opciones'];
  cargando : boolean = false;
  mayorNumero : number =0;
  @ViewChild ("paginator") paginator2:any;
  @ViewChild(MatSort, { static: true })
  sort: MatSort = new MatSort;
  metodos=new RepeteadMethods ()
  manualmodel=new ManualModel()
archivo:string=""
nombre:string=""
fecha:string=""

  constructor(
    private sanitizer: DomSanitizer,
    private manualservice :ManualService,
    private dialog : NgDialogAnimationService,
    private notificationService: NotificationService,


    
  ) { }
  ngOnInit(): void {
    this.llenarTabla();

  }

  sanitizeUrl(archivo: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(archivo);
}
async eliminar(id:number){
  let dialogRef = await this.dialog.open(DeleteManualComponent,
    {data: {idManual: id},
    animation: { to: "bottom" },
      height:"auto", width:"300px",
    });
    
    await dialogRef.afterClosed().subscribe((result : any) => {
      try{
      if(result.length > 0  ){
        this.ELEMENT_DATA = this.metodos.arrayRemove(this.ELEMENT_DATA, this.metodos.buscandoIndice(id,this.ELEMENT_DATA,"id"),"id")
     
        this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
        this.dataSource.paginator = this.paginator2;
        this.dataSource.sort = this.sort;
      setTimeout(()=>{
        this.notificationService.openSnackBar("Se elimino con exito");
      })
    }
    }catch(Exception){}
    });
}



async editar(id:number,nombre:string){
  let dialogRef = await this.dialog.open(EditManualComponent,
    {data: {idManual: id,nombre:nombre},
    animation: { to: "bottom" },
      height:"auto", width:"300px",
    });
    
    await dialogRef.afterClosed().subscribe((result : any) => {
      this.llenarTabla();
      /** 
      try{
      if(result.length > 0  ){
        this.ELEMENT_DATA = this.ELEMENT_DATA, this.metodos.buscandoIndice(id,this.ELEMENT_DATA)
     
        this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
        this.dataSource.paginator = this.paginator2;
        this.dataSource.sort = this.sort;
      setTimeout(()=>{
        this.notificationService.openSnackBar("Se actualizo con exito");
      })
    }
    }catch(Exception){}
  */});
}

  newManual(){
    let dialogRef  = this.dialog.open(NewManualComponent,
      {data: {opc : false, id: this.mayorNumero },
      animation: { to: "bottom" },
      height:"auto", width:"500px",
     });
    
     this.paginator2.firstPage();
     dialogRef.afterClosed().subscribe((result:any)=>{
       this.llenarTabla();
       /**console.log(result.id);
       
       try{
         console.log(result);
      if(result != undefined  ){
       
     console.log(result);
     
   
          
        this.ELEMENT_DATA.unshift({id: result.id ,nombre: result.nombre,fecha:result.fecha,tipo:result.tipo,usaurio:result.usuario,cveAsunto:this.Asunto(result.cveAsunto),tamano:result.tamano,archivo:result.archivo});
        this.dataSource =  new MatTableDataSource(this.ELEMENT_DATA)
        this.dataSource.paginator = this.paginator2;    
        this.dataSource.sort = this.sort;
        }
        setTimeout(()=>{
        this.notificationService.openSnackBar("Se agrego con exito");
        })
      }catch(Exception){}
    */})
  }
  numeroMayor(numero : number){
    if (this.mayorNumero <numero){
      this.mayorNumero = numero
    }
}
async llenarTabla(){
  
  
  
  this.cargando = false;
  this.ELEMENT_DATA = [];
  this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  await this.manualservice.llamarManual().toPromise().then( (result : any) =>{
    
    
    
    for (let i=0; i<result.container.length; i++){
      
    this.ELEMENT_DATA.push(
      {id: result.container[i]["idManual"],nombre: result.container[i]["nombre"], fecha: result.container[i]["fecha"],tipo:this.documento(result.container[i]["tipo"])
    }
    
    );
  

  this.numeroMayor(result.container[i]["idManual"]);
  }

  
    this.dataSource =  new MatTableDataSource(this.ELEMENT_DATA);
    console.log(this.ELEMENT_DATA);
    
    
    this.dataSource.paginator =  this.paginator2;
    this.cargando = true;
    
    
  });
    
}
hayManual(){
  if(this.ELEMENT_DATA != 0 || this.cargando ==false){
    return true;
  }else{
    return false;
  }
}
applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();

 this.ELEMENT_PRINT=this.dataSource.filteredData


 
  
  
}


imprimir() {
  const arrayDatos= []; 
  let i=0;
    // Datos del array
    if (this.ELEMENT_PRINT.length==0){

    }

    for (let i=0; i<this.ELEMENT_PRINT.length; i++){
    arrayDatos.push(this.ELEMENT_PRINT["id"],['nombre'],['fecha'],['tipo'])
   
  }
  
      console.log(arrayDatos);
      
    const doc = new jsPDF();

    
const headers=[
 'Id', 'Nombre', 'RFC', 'Correo'
];
  
    console.log(arrayDatos);
    
    

    // Generar el PDF
    (doc as any).autoTable({
      head: [headers],
      body: [arrayDatos] ,
    



      columnStyles: {
        0: { columnWidth: 50 }, // Ancho de la primera columna
        1: { columnWidth: 40 },  // Ancho de la segunda columna
        2: { columnWidth: 40 }  // Ancho de la segunda columna
      }
    });

    // Abrir el PDF en una nueva pestaña del navegador
    doc.output('dataurlnewwindow');
  }




documento(numero:number) {
  switch(numero){
    case 1:
      return "Imagen"
    case 2:
      return "PDF"
      case 3:
      return "Documento"
  }
  
  
}
Asunto(numero:number) {
  switch(numero){
    case 1:
     return "Ninguno"
    case 2:
      return "Configurar radios"
      case 3:
        return "Cambio de frecuencias"
        case 4:
          return "Tunel"
          case 5:
            return "VPN"
  }
}


}

