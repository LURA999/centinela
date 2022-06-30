import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-search-id',
  templateUrl: './search-id.component.html',
  styleUrls: ['./search-id.component.css']
})
export class SearchIdComponent implements OnInit {

  form : FormGroup = this.fb.group({
    ns: '',
    rs: '',
    empresa: ''
  })

  constructor(private fb :FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<SearchIdComponent>) { 

   }

  ngOnInit(): void {
  
  }

  enviarIdentificador(){
    if(this.form.value.ns?this.form.value.ns:this.form.value.ns?this.form.value.ns:this.form.value.empresa !== undefined ||
      this.form.value.ns?this.form.value.ns:this.form.value.ns?this.form.value.ns:this.form.value.empresa !== "")
      {
        this.dialogRef.close({identificador:this.form.value.ns?this.form.value.ns:this.form.value.ns?this.form.value.ns:this.form.value.empresa})
      }else{
        alert("Por favor ingrese seleccione un identificador");
      }
  }

}
