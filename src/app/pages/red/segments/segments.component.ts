import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NewSegmentComponent } from '../new-segment/new-segment.component';
import { NgDialogAnimationService } from 'ng-dialog-animation';
import { InfoComponent } from '../info/info.component';
import { DeleteComponent } from '../delete/delete.component';

@Component({
  selector: 'app-segments',
  templateUrl: './segments.component.html',
  styleUrls: ['./segments.component.css']
})
export class SegmentsComponent implements OnInit {
  ELEMENT_DATA: any = [
    {
    id: "ejemplo",
    nombre: "ejemplo",
    segmento: "ejemplo",
    diagonal:"ejemplo",
    tipo:"ejemplo",
    estatus:"ejemplo",
    repetidora:"ejemplo",
    opciones:"ejemplo"
    }
  ];

  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  displayedColumns: string[] = ['id', 'nombre', 'segmento', 'diagonal', 'tipo', 'estatus', 'repetidora', 'opciones'];

  constructor(
    private dialog : NgDialogAnimationService
  ) { }

  nuevoSegmento (){
    this.dialog.open(NewSegmentComponent,
      {data: {idCliente : "", opc: false},
      animation: { to: "bottom" },
        height:"auto", width:"300px",
      });
  }

  editarSegmento (){
    this.dialog.open(NewSegmentComponent,
      {data: {idCliente : "", opc:true},
      animation: { to: "bottom" },
      height:"auto", width:"300px",
      });
  }

  eliminarSegmento (){
    this.dialog.open(DeleteComponent,
      {data: {idCliente : ""},
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
  
  ngOnInit(): void { }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
