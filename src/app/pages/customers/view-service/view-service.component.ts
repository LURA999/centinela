import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ServiceService } from 'src/app/core/services/services.service';
import { responseService } from 'src/app/models/responseService.model';


@Component({
  selector: 'app-vista-servicio',
  templateUrl: './view-service.component.html',
  styleUrls: ['./view-service.component.css']
})
export class ViewServiceComponent implements OnInit {
  
  constructor(private activoRouter : ActivatedRoute, private service : ServiceService) { }

  idCliente = this.activoRouter.snapshot.params["id"]
  identificador = this.activoRouter.snapshot.params["identificador"]
  
  servicio : Observable<responseService> | undefined;
  

  ngOnInit(): void {
    console.log(this.identificador.slice(2,7));
    
    this.servicio = this.service.selectVistaServicio(this.identificador.slice(0,2),Number(this.identificador.slice(2,7)))    
  }

  
  abrirMapa(direccion : string, ciudad : string,coordenadas : string){
    window.open("https://www.google.com/maps/place/"+direccion+"+"+ciudad+"/@"+coordenadas, "_blank");
  }
}
