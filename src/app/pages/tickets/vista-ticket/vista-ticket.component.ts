import { Component, OnInit } from '@angular/core';


export interface Comment {
  cols: number;
  rows: number;
  text: string;
  title : string;
}

@Component({
  selector: 'app-vista-ticket',
  templateUrl: './vista-ticket.component.html',
  styleUrls: ['./vista-ticket.component.css']
})


export class VistaTicketComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  
  comment: Comment[] = [
    {text: 'One',title:"Problema 1", cols: 4, rows: 1 },
    {text: 'Two',title:"Problema 2", cols: 4, rows: 1 },
    {text: 'Three',title:"Problema 3", cols: 4, rows: 1 },
    {text: 'Four',title:"Problema 4", cols: 4, rows: 1},
    {text: 'One',title:"Problema 1", cols: 4, rows: 1 },
    {text: 'Two',title:"Problema 2", cols: 4, rows: 1 },
    {text: 'Three',title:"Problema 3", cols: 4, rows: 1 },
    {text: 'Four',title:"Problema 4", cols: 4, rows: 1},
    {text: 'One',title:"Problema 1", cols: 4, rows: 1 },
    {text: 'Two',title:"Problema 2", cols: 4, rows: 1 },
    {text: 'Three',title:"Problema 3", cols: 4, rows: 1 },
    {text: 'Four',title:"Problema 4", cols: 4, rows: 1},
  ];
}
