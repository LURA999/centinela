import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-new-rs',
  templateUrl: './new-rs.component.html',
  styleUrls: ['./new-rs.component.css']
})
export class NewRsComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

  crearRS(){
    
  }

}
