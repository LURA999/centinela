import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SegmentsService } from 'src/app/services/segments.service';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.css']
})
export class DeleteComponent implements OnInit {
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private segmentsService : SegmentsService,public dialogRef: MatDialogRef<DeleteComponent>) { }

  ngOnInit(): void {

  }
  
  async confirmar(){
    await this.segmentsService.updateElimSegment(this.data.idSegmento).subscribe(); 
     this.dialogRef.close('Se ha eliminado con exito');


  }
}
