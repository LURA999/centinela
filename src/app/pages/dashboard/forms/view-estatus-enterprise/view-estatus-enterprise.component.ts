import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-view-estatus-enterprise',
  templateUrl: './view-estatus-enterprise.component.html',
  styleUrls: ['./view-estatus-enterprise.component.css']
})
export class ViewEstatusEnterpriseComponent {

 
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,public dialogRef: MatDialogRef<ViewEstatusEnterpriseComponent>) {
    
   }

}
