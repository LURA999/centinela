import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CustomerService } from '../../../../core/services/customer.service';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.css']
})
export class DeleteComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private servicioCliente : CustomerService,public dialogRef: MatDialogRef<DeleteComponent>) { }

  ngOnInit(): void {

    console.log(this.data)
  }
  

  async confirmar(){
   await this.servicioCliente.eliminarFalso(this.data.idCliente).subscribe();
    this.dialogRef.close('Se ha eliminado con exito');
  
  }

  closeDialog(){

  }
}