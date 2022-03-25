import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { NgbPaginationConfig } from '@ng-bootstrap/ng-bootstrap';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MyCustomPaginatorIntl } from './MyCustomPaginatorIntl';
import { NuevoClienteComponent } from '../nuevo-cliente/nuevo-cliente.component';
import { NgDialogAnimationService } from 'ng-dialog-animation';
import * as XLSX from 'xlsx';
import { CustomerService } from 'src/app/services/customer.service';
import { DeleteComponent } from '../delete/delete.component';
import { NotificationService } from 'src/app/services/notification.service';

export interface cliente {
  id : number;
  empresa: string;
  nombre: string;
  estatus: string;
  opciones: string;

}

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css'],
  providers: [{provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl}],
})

export class CustomerListComponent implements OnInit {
  title = 'Centinela';
  fileName= 'Excel_Clientes_Export.Xlsx'; 
  userList = []
  displayedColumns: string[] = ['Empresa', 'Nombre Corto', 'Estatus', 'Opciones'];
  ELEMENT_DATA: cliente[] = [];
  excel : string [][] = [];
  totalItems: number = 0;
  page: number = 0; 
  carga :boolean=false;
  previousPage: number = 0;
  showPagination: boolean = true;
  contenedor_carga : boolean = false;
  slider : boolean = true;
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  @ViewChild ("paginator") paginator:any;
  childMessage: string = "hola desde el componente customer-list";

  exportexcel(): void 
    {
       /* table id is passed over here */   
       let element = document.getElementById('excel-table'); 
       const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);

       /* generate workbook and add the worksheet */
       const wb: XLSX.WorkBook = XLSX.utils.book_new();
       XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

       /* save to file */
       XLSX.writeFile(wb, this.fileName);
			
    }

 

  constructor(
    private titleService: Title,
    private config: NgbPaginationConfig,
    private dialog : NgDialogAnimationService,
    private clienteServicio : CustomerService,
    private notificationService: NotificationService
   ) {
      this.config.boundaryLinks = true;
    }

  
  ngOnInit() : void {
    this.titleService.setTitle('Centinela - Customers');
    this.llenaTabla(); 
  }

  async llenaTabla(){
    await this.clienteServicio.clientesTodos().subscribe((resp : any)=>{
      for(let i of resp.container)
      this.ELEMENT_DATA.push(
        {id: i.idCliente,empresa: i.nombre,nombre:i.nombreCorto,estatus:this.estatus(i.estatus),opciones:'2'}
      );
      this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
      this.dataSource.paginator =  this.paginator;    
      this.paginator.hidePageSize=  true;
    });
   
  }

  async verEstatus(opcion: number) {
    this.dataSource = new MatTableDataSource();
    this.ELEMENT_DATA = [];

    if(opcion < 4){
    await this.clienteServicio.clienteEstatus(opcion).subscribe((resp : any) =>{
      for(let i of resp.container)
      this.ELEMENT_DATA.push(
        {id:i.idCliente,empresa: i.nombre,nombre:i.nombreCorto,estatus:this.estatus(i.estatus),opciones:'2'}
      );
      this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
    })
  }else{
     await this.clienteServicio.clientesTodos().subscribe((resp : any)=>{
      for(let i of resp.container)
      this.ELEMENT_DATA.push(
        {id:i.idCliente,empresa: i.nombre,nombre:i.nombreCorto,estatus:this.estatus(i.estatus),opciones:'2'}
      );
      this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
    });
  }
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  estatus(numero : string) {
    switch(numero){
      case '1':
        return "activo"
      case '2':
        return "inactivo"
      case '3': 
        return "ausente"
      default:
        return ""
    }
  }
  nuevoCliente(){
    this.dialog.open(NuevoClienteComponent,
      {data: {opc : "" ,mensaje: ""},
      animation: { to: "bottom" },
        height:"50%", width:"350px",
      });
  }

  async onFileChange(evt: any){
    const target : DataTransfer = <DataTransfer>(evt.target);
     let formato= ""+target.files[0].name.split(".")[target.files[0].name.split(".").length-1];

    if(formato == "xlsm" ||formato == "xlsx" || formato == "xlsb" ||formato == "xlts" ||formato == "xltm" ||formato == "xls" ||formato == "xlam" ||formato == "xla"||formato == "xlw" ){
      if(target.files.length !==1) 
      throw  alert('No puedes subir multiples archivos') ;
      
      const reader: FileReader= new FileReader();
      reader.onload = async (e: any) =>{
      const bstr : string = e.target.result;
      const wb : XLSX.WorkBook = XLSX.read(bstr, {type:'binary'});
      const wsname : string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      this.excel = (XLSX.utils.sheet_to_json(ws,{header: 1}));
      try{
       //insertar dos tablas juntas 
       if(this.excel[0].length == 3){ 
        this.contenedor_carga = await false;
        this.slider = await false;
        for (let p=0; p<this.excel.length; p++) {
         let repetidocliente:any = await this.clienteServicio.clienteRepetido(this.excel[p][0]).toPromise();
         repetidocliente = repetidocliente.container;

           try{
             if(this.excel[p][0] !== undefined  && repetidocliente[0].repetido == 0 || this.excel[p][0] == "" && repetidocliente[0].repetido == 0){    
               await this.clienteServicio.insertaCliente({empresa:this.excel[p][0], nombre: this.excel[p][1],estatus:+this.excel[p][2]}).subscribe();
             }
            }catch(Exception){}
         }
     await location.reload();
       }
      }catch(Exception){
        this.contenedor_carga = await true;
        this.slider = await true;
        alert("No se permiten archivos vacios")
      }

      };
      await reader.readAsBinaryString(target.files[0]);
    }else{
      alert("Solo se permiten tipos de archivos Excel")
    }
  }


  editar(empresa : string, nombre : string,estatus:string,id:number){
    let dialogRef  = this.dialog.open(NuevoClienteComponent,
      {data: {empresa : empresa == undefined || empresa == "" 
      || empresa.length>0 ? empresa: "", nombre : nombre == undefined || nombre == "" 
      || nombre.length>0 ? nombre: "",estatus:estatus == undefined || estatus == "" 
      || estatus.length>0 ? estatus: "",id:id == undefined ? id: ""},
      animation: { to: "bottom" },
        height:"auto", width:"300px",
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log(result)
        if(result.length > 0){
          setTimeout(() => {
            this.notificationService.openSnackBar(result);
          });
          }
      });
  }

  eliminar(id:number){
    let dialogRef = this.dialog.open(DeleteComponent,
      {data: {idCliente : id},
      animation: { to: "bottom" },
        height:"auto", width:"300px",
      });

      dialogRef.afterClosed().subscribe((result : any) => {
        if(result.length > 0){
        setTimeout(() => {
          this.notificationService.openSnackBar(result);
        });
        }
      });
      
  }
  
}
