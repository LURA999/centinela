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
import { Workbook } from 'exceljs'
import * as fs from 'file-saver';

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


  constructor(
    private titleService: Title,
    private config: NgbPaginationConfig,
    private dialog : NgDialogAnimationService,
    private clienteServicio : CustomerService,
    private notificationService: NotificationService
   ) {
      this.config.boundaryLinks = true;
    }


  llenarArchivoExcel(json_data : any){


    for (let x = 0; x < this.ELEMENT_DATA.length; x++) {
     json_data.push({ });
      
    }
    return json_data
  }

  async exportexcel() 
  {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet("Employee Data");
    let header : string[]=["Id","Empresa","Nombre corto","Estatus"]
    worksheet.addRow(header);
  
    for  (let x1 in this.ELEMENT_DATA)
    {
      let x2=Object.keys(x1);
      let temp : any=[]
      for(let y of x2)
      {
        temp.push(this.ELEMENT_DATA[x1]["id" ])
        temp.push(this.ELEMENT_DATA[x1]["empresa"])
        temp.push(this.ELEMENT_DATA[x1]["nombre"])
        temp.push(this.ELEMENT_DATA[x1]["estatus"])
      }
      worksheet.addRow(temp)
    }

    let fname="ExcelClientes"

//add data and file name and download
workbook.xlsx.writeBuffer().then((data) => {
  let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  fs.saveAs(blob, fname+'-'+new Date().valueOf()+'.xlsx');
});
  }
  
  ngOnInit() : void {
    this.titleService.setTitle('Centinela - Customers');
    this.llenaTabla(); 
  }

  async llenaTabla(){
    this.ELEMENT_DATA = [];
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
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
  estatusNumero(numero : string) {
    switch(numero){
      case 'activo':
        return '1'
      case 'inactivo':
        return '2'
      case 'ausente': 
        return '3'
      default:
        return ""
    }
  }
  async nuevoCliente(){
    let dialogRef  = this.dialog.open(NuevoClienteComponent,
      {data: {opc : false },
      animation: { to: "bottom" },
        height:"50%", width:"350px",
      });

      await dialogRef.afterClosed().subscribe(result => {
        try{
        if(result.length > 0  || result != undefined ){
          setTimeout(() => {
            this.notificationService.openSnackBar(result);
            this.llenaTabla()
          });
          }
        }catch(Exception) {}
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


  async editar(empresa : string, nombre : string,estatus:string,id:number){
    let dialogRef  = this.dialog.open(NuevoClienteComponent,
      {data: {empresa : empresa, nombre : nombre ,estatus:this.estatusNumero(estatus) ,id:id , opc:true},
      animation: { to: "bottom" },
        height:"auto", width:"300px",
      });
      
      await dialogRef.afterClosed().subscribe(result => {
        try{
        if(result.length > 0  ){
          setTimeout(() => {
            this.notificationService.openSnackBar(result);
            this.llenaTabla()
          });
          }
        }catch(Exception) {}
      }); 
    
  }

  eliminar(id:number){
    let dialogRef = this.dialog.open(DeleteComponent,
      {data: {idCliente : id},
      animation: { to: "bottom" },
        height:"auto", width:"300px",
      });

      dialogRef.afterClosed().subscribe((result : any) => {
        try{
        if(result.length > 0  ){
        setTimeout(() => {
          this.notificationService.openSnackBar(result);
          this.llenaTabla()
        });
        }
      }catch(Exception){}
      });
      
  }
  
}
