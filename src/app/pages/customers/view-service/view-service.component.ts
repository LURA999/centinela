import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { throws } from 'assert';
import { Observable } from 'rxjs';
import { DataService } from 'src/app/core/services/data.service';
import { ServiceService } from 'src/app/core/services/services.service';
import { responseService } from 'src/app/models/responseService.model';
import { RepeteadMethods } from '../../RepeteadMethods';


@Component({
  selector: 'app-vista-servicio',
  templateUrl: './view-service.component.html',
  styleUrls: ['./view-service.component.css']
})
export class ViewServiceComponent implements OnInit {
  idCliente = this.activoRouter.snapshot.params["id"]
  identificador = this.activoRouter.snapshot.params["identificador"]
  servicio : Observable<responseService> | undefined;
  metodo = new RepeteadMethods()
  navLinks  =[
    {
      label: 'Otros dipositivos',
      link: './',
      index: 0
    }, {
      label: 'Radios',
      link: './radio',
      index: 1
    }, {
      label: 'Routers',
      link: './router',
      index: 2
    }, 
  ];
  activeLink = this.navLinks[0].link;

  constructor(private activoRouter : ActivatedRoute, private service : ServiceService
    , private DataService : DataService, private router : Router) {
      this.servicio = this.service.selectVistaServicio(this.identificador.slice(0,2),Number(this.identificador.slice(2,7)))
      let diagonal = this.router.url.split("/",6)[5];
      if(diagonal != undefined){
        this.activeLink = "./"+diagonal
      }    
    }


  ngOnInit(): void {


  }

  abrirMapa(direccion : string, ciudad : string,coordenadas : string){
    if(coordenadas ==undefined){

    }
    window.open("https://www.google.com/maps/place/"+coordenadas, "_blank");
  }


  agregar(form : string){
    this.DataService.open.emit(form)
  }

}
