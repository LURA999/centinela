import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NewSegmentComponent } from '../new-segment/new-segment.component';
import { NgDialogAnimationService } from 'ng-dialog-animation';
import { InfoComponent } from '../info/info.component';
import { DeleteComponent } from '../delete/delete.component';
import { MatSort } from '@angular/material/sort';
import { SegmentsService } from 'src/app/services/segments.service';

@Component({
  selector: 'app-segments',
  templateUrl: './segments.component.html',
  styleUrls: ['./segments.component.css']
})
export class SegmentsComponent implements OnInit {
 
   

  ELEMENT_DATA: any = [ ];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  displayedColumns: string[] = ['id','nombre', 'segmento', 'diagonal', 'tipo', 'estatus','repetidora','opciones'];
  cargando = false;
  @ViewChild ("paginator") paginator2:any;
  @ViewChild(MatSort, { static: true })
  sort: MatSort = new MatSort;


  constructor(
    private dialog : NgDialogAnimationService,
    private segmentServicio : SegmentsService,
  ) { }

  nuevoSegmento (){
    this.dialog.open(NewSegmentComponent,
      {data: {idCliente : "", opc: false},
      animation: { to: "bottom" },
        height:"auto", width:"300px",
      });
  }

  editarSegmento (id:number){
    this.dialog.open(NewSegmentComponent,
      {data: {idSegmento : id, opc:true},
      animation: { to: "bottom" },
      height:"auto", width:"300px",
      });
  }

  eliminarSegmento (id:number){
    console.log(id);
    
    this.dialog.open(DeleteComponent,
      {data: {idSegmento : id},
      animation: { to: "bottom" },
      height:"auto", width:"300px",
      });
  }

  info (){
    this.dialog.open(InfoComponent,
    {data: {idCliente : ""},
    animation: { to: "bottom" },
    height:"auto", width:"300px",
  });
  }
  
  ngOnInit(): void {
    this.llenarTabla()
   }
  async llenarTabla(){
    this.cargando = false;
    this.ELEMENT_DATA = [];
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);

    await this.segmentServicio.llamarSegments().toPromise().then( (result : any) =>{
   console.log(result)
      for (let i=0; i<result.container.length; i++)
      this.ELEMENT_DATA.push(
        {id: result.container[i]["idSegmento"],nombre: result.container[i]["nombre"],segmento:result.container[i]["segmento"]
          ,diagonal:result.container[i]["diagonal"],tipo:result.container[i]["tipo"], estatus:result.container[i]["estatus"], repetidora:result.container[i]["cveRepetdora"]}
      );
      this.dataSource =  new MatTableDataSource(this.ELEMENT_DATA);
      this.dataSource.paginator =  this.paginator2;    
      this.dataSource.sort =  this.sort;
      this.cargando = true;
    });
      
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
