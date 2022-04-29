import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SegmentsService } from '../../../../core/services/segments.service';
import { RepeaterService } from '../../../../core/services/repeater.service';
import { ContactService } from '../../../../core/services/contact.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.css']
})
export class DeleteComponent implements OnInit {
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private segmentsService : SegmentsService, private repeaterCliente : RepeaterService
  ,public dialogRef: MatDialogRef<DeleteComponent>,private contactService:ContactService) { }

  ngOnInit(): void {

  }
  
  async confirmar(){

    switch(this.data.opc){
      case 1:       
        await lastValueFrom(this.segmentsService.updateElimSegment(this.data.idSegmento)); 
        this.dialogRef.close('Se ha eliminado con exito');
        break;
      case 2:
        await lastValueFrom(this.repeaterCliente.deleteRepetidor(this.data.idCliente));
        this.dialogRef.close('Se ha eliminado con exito');
        break;
      case 3:
        await lastValueFrom(this.contactService.deleteContacto(this.data.idContacto));
        this.dialogRef.close('Se ha eliminado con exito');
        break;
    }
  }
}
