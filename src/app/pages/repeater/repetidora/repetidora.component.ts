import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NgDialogAnimationService } from 'ng-dialog-animation';
import { NewRepeaterComponent } from '../new-repeater/new-repeater.component';

@Component({
  selector: 'app-repetidora',
  templateUrl: './repetidora.component.html',
  styleUrls: ['./repetidora.component.css']
})
export class RepetidoraComponent implements OnInit {
  ELEMENT_DATA: any = [
  
    {
    nombre: "ejemplo",
    latitud: "ejemplo",
    longitud: "ejemplo",
    ciudad:"ejemplo",
    estatus:"ejemplo",
    
    }

];
dataSource = new MatTableDataSource(this.ELEMENT_DATA);
displayedColumns: string[] = ['nombre', 'latitud', 'longitud', 'ciudad', 'estatus','opciones'];

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
