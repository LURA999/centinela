import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NgDialogAnimationService } from 'ng-dialog-animation';
import { NewRepeaterComponent } from '../new-repeater/new-repeater.component';

@Component({
  selector: 'app-repetidoraycontacto',
  templateUrl: './repetidoraycontacto.component.html',
  styleUrls: ['./repetidoraycontacto.component.css']
})
export class RepetidoraycontactoComponent implements OnInit {
  ELEMENT_DATA: any = [
  
    {
      id:"ejemplo",
    nombre: "ejemplo",
    telefono: "ejemplo",
    correo:"ejemplo",
    estatus:"ejemplo",
    
    }
];

dataSource = new MatTableDataSource(this.ELEMENT_DATA);
displayedColumns: string[] = ['id', 'nombre', 'telefono', 'correo', 'estatus','opciones'];

ELEMENT_DATA2: any = [
  
  {
    id:"ejemplo",
  seg: "ejemplo",
  x: "ejemplo",
  tipo:"ejemplo",
  nom:"ejemplo",
  
  }
];

dataSource2 = new MatTableDataSource(this.ELEMENT_DATA2);
displayedColumns2: string[] = ['id', 'seg', 'x', 'tipo', 'nom','opciones'];



constructor(private dialog:NgDialogAnimationService) { 
 
}
 

  ngOnInit(): void {
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  Newregister(){
    let dialogRef  = this.dialog.open(NewRepeaterComponent,
      {data: {opc : false },
      animation: { to: "bottom" },
      height:"auto", width:"350px",
     });
  }
}
