import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ContactService } from 'src/app/services/contact.service';

@Component({
  selector: 'app-new-contact',
  templateUrl: './new-contact.component.html',
  styleUrls: ['./new-contact.component.css']
})
export class NewContactComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private contactService :ContactService,
  public dialogRef: MatDialogRef<NewContactComponent>,
  ) { }

  ngOnInit(): void {
    console.log(this.data)
  }

  async crearContacto(select : number,nombre : string ,telefono : string, correo : string,selectRep : number){
    if(this.data.opc== false){
    await this.contactService.insertarContacto({telefono:telefono, correo:correo, estatus:select,nombre:nombre,repetidora:this.data.cveRepetidora}).toPromise()
    this.dialogRef.close({telefono:+telefono, correo:correo, estatus:select,nombre:nombre,repetidora:selectRep, mensaje:"se pudo"});
    }else{
      await this.contactService.updateContacto({telefono:telefono, correo:correo, estatus:select,nombre:nombre,repetidora:this.data.cveRepetidora}).toPromise()
      this.dialogRef.close({telefono:+telefono, correo:correo, estatus:select,nombre:nombre,repetidora:selectRep, mensaje:"se pudo"});   
    }
  }

  ver(){
    return this.data.repetidora;
  }
}
