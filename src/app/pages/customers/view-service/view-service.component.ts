import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgDialogAnimationService } from 'ng-dialog-animation';
import { Observable } from 'rxjs';
import { DataService } from 'src/app/core/services/data.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { ServiceService } from 'src/app/core/services/services.service';
import { MapsModel } from 'src/app/models/maps.model';
import { responseService } from 'src/app/models/responseService.model';
import { RepeteadMethods } from '../../RepeteadMethods';
import { EditAddressComponent } from '../popup/edit-address/edit-address.component';

interface mapaDireccion {
  ciudad:string ;
  coordenadas:string ; 
  estado : string ;
  latitud : string ;
  longitud : string ;
  codigoPostal : string ;
  colonia : string ;
  numero : string ;
  cveCiudad : string ;
}

@Component({
  selector: 'app-vista-servicio',
  templateUrl: './view-service.component.html',
  styleUrls: ['./view-service.component.css']
})
export class ViewServiceComponent implements OnInit {
  load : boolean = false;
  direccionMapa!: mapaDireccion;
  idCliente = this.activoRouter.snapshot.params["id"]
  identificador :string = this.activoRouter.snapshot.params["identificador"].replace(/([0-9]{4})\S/,"");
  contadorIdenti :string = this.activoRouter.snapshot.params["identificador"].replace(/[0-9]*[A-Za-z]/,"");
  servicio : any [] =[];
  metodo = new RepeteadMethods()
  ciudad:string | undefined;
  coordenadas:string | undefined; 
  estado : string | undefined;
  latitud : string | undefined;
  longitud : string | undefined;
  codigoPostal : string | undefined;
  colonia : string | undefined;
  numero : number | undefined;
  cveCiudad : number | undefined;
  avenida : string | undefined;
  ruta : string ="";
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
    , private DataService : DataService, private router : Router,private dialog:NgDialogAnimationService,
    private notificationService: NotificationService, private renderer : Renderer2) {   
      let diagonal = this.router.url.split("/",6)[5];
      if(diagonal != undefined){
        this.activeLink = "./"+diagonal
      }    
    }


  ngOnInit(): void {
     this.service.selectVistaServicio(this.identificador, Number(this.contadorIdenti),1).subscribe((resp:responseService)=>{
      this.servicio = resp.container
      this.ruta = "https://maps.google.com/maps?q="+(this.servicio[0].avenida+" "+this.servicio[0].numero
      +", "+this.servicio[0].colonia+", "+this.servicio[0].codigoPostal+" "+this.servicio[0].ciudad
      +", "+this.servicio[0].estado).replace(/\ /gi,'%20')+"&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
      const m = this.renderer.createElement("iframe")
      const divp = document.querySelector("mapa")
      this.renderer.appendChild(divp,m)
      this.renderer.setStyle
      this.load = true
    })

  }

  abrirMapaCoordendas(coordenadas : string){
    window.open(("https://www.google.com/maps/place/"+coordenadas).replace(/\ /gi,'+'), "_blank");
  }
  
  abrirMapaDireccion(avenida: string, numero: string, colonia: string, codigoPostal: string, 
    ciudad: string,  estado: string){
  /* if(codigoPostal == undefined){
   // window.open("https://www.google.com/maps/place/av.+"+direccionArray[0].replace(/\ /gi,'+').replace("#","")+",+"+direccionArray[1].replace(/\ /gi,'+')+",+"+direccionArray[2].replace(/\ /gi,'+')+","+direccionArray[3].replace(/\ /gi,'+'), "_blank");
   }else{*/
    window.open(("https://www.google.com/maps/place/av. "+avenida+" "+numero+", "+colonia+", "+codigoPostal+" "+ciudad+", "+estado).replace(/\ /gi,'+'), "_blank");
  // }

  }
  editarMapa(idServicio : number,ciudad: string,coordenadas: string,numero: number, 
    colonia: string, 
    codigoPostal: number,  
    estado: string,cveCiudad: number, avenida:number){      
    let dialogRef = this.dialog.open(EditAddressComponent,
      {data: {idServicio:idServicio,ciudad: ciudad,coordenadas: coordenadas,numero: numero, 
        colonia: colonia, 
        codigoPostal: codigoPostal,  
        estado: estado,cveCiudad: cveCiudad, avenida:avenida},
        animation: { to: "bottom" },
        height:"auto", width:"300px",
      });

    dialogRef.afterClosed().subscribe((result:MapsModel)=>{
      if(result !=undefined){        
       try{
        this.cveCiudad = result.cveCiudad
        this.ciudad=result.ciudad,
        this.coordenadas=result.latitud+", "+result.longitud,
        this.estado =result.estado
        this.latitud =result.latitud
        this.longitud =result.longitud
        this.codigoPostal =result.codigoPostal
        this.colonia =result.colonia
        this.numero =result.numero
        this.cveCiudad =result.cveCiudad   
        this.avenida = result.avenida     
        setTimeout(()=>{
        this.notificationService.openSnackBar("Se edito con exito");
        })
       }catch(Exception){}
      }
     })
  }

  agregar(form : string){    
    this.DataService.open.emit(form)
  }

}

