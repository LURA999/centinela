import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RepeaterService } from 'src/app/services/repeater.service';
import { ContactService } from 'src/app/services/contact.service';
@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.css']
})
export class DeleteComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private repeaterCliente : RepeaterService
  ,public dialogRef: MatDialogRef<DeleteComponent>,private contactService:ContactService) { }

  ngOnInit(): void {

  }
  

  async confirmar(){
    if(this.data.opc ==false){
      await this.repeaterCliente.deleteRepetidor(this.data.idCliente).subscribe();
      this.dialogRef.close('Se ha eliminado con exito');
    }else{
      await this.contactService.deleteContacto(this.data.idContacto).subscribe();
      this.dialogRef.close('Se ha eliminado con exito');
    }

  
  }

  closeDialog(){

  }
}
