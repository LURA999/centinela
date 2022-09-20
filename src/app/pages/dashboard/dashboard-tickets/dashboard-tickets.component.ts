import { BreakpointObserver, Breakpoints, MediaMatcher } from '@angular/cdk/layout';
import { AfterViewInit, Component, Inject, Input, LOCALE_ID, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexFill,
  ApexTooltip,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexTheme
} from "ng-apexcharts";
import { EventEmitter } from '@angular/core';
import { DataService } from 'src/app/core/services/data.service';
import { DataLayoutService } from 'src/app/core/services/dataLayout.service';
import { Subscription } from 'rxjs';
import { formatDate } from '@angular/common';
import {  dashboardTicketsService } from 'src/app/core/services/dashboardTickets.service';
import { responseService } from 'src/app/models/responseService.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { DeviceModel } from 'src/app/models/device.model';
import { NgDialogAnimationService } from 'ng-dialog-animation';
import { ViewTicketsEnterpriseComponent } from '../forms/view-tickets-enterprise/view-tickets-enterprise.component';
import { ViewEstatusEnterpriseComponent } from '../forms/view-estatus-enterprise/view-estatus-enterprise.component';
import { AuthService } from 'src/app/core/services/auth.service';

export type ChartOptionsLine = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  tooltip:ApexTooltip;
    yaxis:ApexYAxis;

};
export type ChartOptionsBar = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
  title: ApexTitleSubtitle;
};

export type ChartOptionsPie = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  theme: ApexTheme;
  title: ApexTitleSubtitle;
  dataLabels:ApexDataLabels;
  legend:ApexLegend;
};

 interface topEmpresa {
  idCliente:number;
  nombre: string;
  totalTicket: number;
}



 interface estadoServicio {
  idEstadoTicket: number;
  estado: string;
  totalTicket: number;
}
interface tiposTickets {
  idTipoTicket:number,
  nombre:string,
  totalTicket : number
}


interface tickets {
  idTicket: number;
  servicio:string;
  fechaAbierta:string;
  fechaCerrada:string | undefined;
  grupo:string;
  estado:string;
}

interface servicioTicket {
  idServicio?: number,
  nombre: string,
  totalTicket: number
}

interface grupo{
  name:string
  data :number[]
  }

@Component({
  selector: 'app-dashboard-tickets',
  templateUrl: './dashboard-tickets.component.html',
  styleUrls: ['./dashboard-tickets.component.css']
})
export class DashboardTicketsComponent implements OnInit,AfterViewInit,OnDestroy {
  selected : Date | undefined;
  selected2 : Date | undefined;
  cargando : boolean = false;

  selectedFake : string ="";
  selectedFake2 : string ="";

  //Configuracion de calendario
  ocultarDate : boolean = false
  oCalendario : boolean = false;
  fechaRango : boolean = false;

  optionsDate :any = { year: 'numeric', month: 'long', day: 'numeric' };

  //variables para las graficas
  @ViewChild("chartLine") chartLine!: ChartComponent;
  public chartOptionsLine!: Partial<ChartOptionsLine>;

  @ViewChild("chartBar") chartBar!: ChartComponent;
  public chartOptionsBar!: Partial<ChartOptionsBar>;

  @ViewChild("chartPie") chartPieTipos!: ChartComponent;
  public chartOptionsPieTipos!: Partial<ChartOptionsPie>;

  @ViewChild("chartPie") chartPieAgentes!: ChartComponent;
  public chartOptionsPieAgentes!: Partial<ChartOptionsPie>;

  empresa: topEmpresa[] = [ ];
  tiposTickets: tiposTickets[] = [ ];
  estadoServicio: estadoServicio [] = [];
  servicioTicket: servicioTicket [] = [];


  //variables apra manipular graficas (responsive)
  $sub = new Subscription()
  @Output() mobile = new EventEmitter<number>();

  //variables para capturar las fechas
  date : Date = new Date();
  primerDia :Date= new Date(this.date.getFullYear(), this.date.getMonth(), 1);
  ultimoDia :Date= new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0);

  primerDiaString :string = formatDate(this.primerDia,'yyyy-MM-dd',"en-US");
  ultimoDiaString :string= formatDate(this.ultimoDia,'yyyy-MM-dd',"en-US");

  //Para la tabla
  ELEMENT_DATA:  any[] = [ ];
  inicio : number=0;
  fin : number=6;
  tickets : tickets []=[]
  displayedColumns: string[] = ['idTicket', 'servicio', 'fechaAbierta', 'fechaCerrada','grupo','estado'];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  @ViewChild ("paginator") paginator!:MatPaginator;

  //
  grupos : grupo []=[]
  fechaLabel:string[]=[]

  //variables para abrir el form
  fecha1:string = ""
  fecha2:string = ""

  

  constructor(private breakpointObserver: BreakpointObserver,mediaMatcher: MediaMatcher,
    private dataService:DataLayoutService, private serviceDash : dashboardTicketsService,
    private dialog:NgDialogAnimationService, private auth : AuthService) {
      this.graficaDeLineas(this.primerDiaString,this.ultimoDiaString)
      this.graficaDeBarras(this.primerDiaString,this.ultimoDiaString)
  }

ngAfterViewInit(): void {
  this.$sub.add(this.breakpointObserver.observe([
    '(max-width: 1200px)'
  ]).subscribe(result => {      
   if (result.matches) {    
   this.dataService.open.emit(1200)
    }
  })) ;
}

ngOnDestroy(): void {
 this.$sub.unsubscribe()
}
  ngOnInit(): void {
    this.llenarListaEstadoTicket(this.primerDiaString,this.ultimoDiaString)
    this.llenarListaEmpresas(this.primerDiaString,this.ultimoDiaString)
    this.llenarListaTickets(this.primerDiaString,this.ultimoDiaString)
    this.llenarPieTipos(this.primerDiaString,this.ultimoDiaString)
    this.llenarPieAgentes(this.primerDiaString,this.ultimoDiaString)
  }

  buscarFecha(){
    this.graficaDeBarras(this.primerDiaString,this.ultimoDiaString)

  }
  
 

  graficaDeBarras(selectedFake:string,selectedFake2:string){
    this.chartOptionsBar = {
      title:{
        text:"Servicios con mas tickets"
      },
      series: [
        {
          name: "fecha",
          data: []
        }
      ],
      chart: {
        type: "bar",
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%"
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"]
      },
      xaxis: {
        title:{
          text:"FILA X"
        },
        categories: [
            this.primerDiaString
        ]
      },
      yaxis: {
        title: {
          text: "FILA Y"
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function(val) {
            return "$ " + val + " thousands";
          }
        }
      }
    };

    this.serviceDash.rangoDeFechas(selectedFake,selectedFake2,6,this.auth.getCveGrupo()).subscribe(async (res : responseService)=>{
      let maxY : number = 0
      let estructura : any []= []
      for await (const i of res.container) {
        maxY = (Number(i.totalTicket) > maxY ? Number(i.totalTicket): maxY)
        estructura.push({
          x:i.nombre,
          y:Number(i.totalTicket),
          goals:[
            {
            name:"Fecha: ",
            value:i.fecha,
            strokeColor:"none",
            }
          ]
        })
      }
      
      this.chartOptionsBar = {
        title:{
          text:"Servicios con mas tickets"
        },
        series: [
          {
            name: "Total de tickets: ",
            data:estructura
          }
        ],
        chart: {
          type: "bar",
          height: 350
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "55%"
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          show: false,
          width: 2,
          colors: ["transparent"]
        },
        xaxis: {
          title:{
            text:"Servicios"
          }
        },
        yaxis: {
          title: {
            text: "Tickets"
          },
          max:Math.ceil(maxY/10)*10
        },
        fill: {
          opacity: 1
        }
      };      
    })
  }


  graficaDeLineas(selectedFake:string,selectedFake2:string){
    this.grupos = []
    this.fechaLabel = []
    var fechaInicio :Date = new Date(selectedFake)
    var fechaFin  :Date  = new Date(selectedFake2);
    var diff = fechaFin.getTime() - fechaInicio.getTime();
    let cantidadMeses :number = Number(fechaFin.getMonth()) + Number(fechaInicio.getMonth())
     
    let diasCantidad :number = (diff/(1000*60*60*24))+1;
    let dataGrupo : number []= []
    let dataGrupoAux : number []= []
    let grupoCambiar : string = ""
    let pasarForAwait : boolean = false
  
    this.chartOptionsLine = {
      series: [
          {
            name: "No hay tickets",
            data:[0]
          }
      ],
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "straight"
      },
      title: {
        text: "Tickets por departamento",
        align: "left"
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5
        }
      },
      xaxis: {
        categories: ["No hay tickets"]
      }
    };
  
    for (let i = 0; i < (
    diasCantidad<=31&&diasCantidad>0?diasCantidad
    :diasCantidad<=90?Math.ceil(diasCantidad/7)
    :diasCantidad<=365?(new Date(this.date.getFullYear(), 2 + 1, 0).getDay() > 28?11:10)
    :0); i++) {
      dataGrupoAux.push(0)
    } 
  
    if (diasCantidad<=31) {
      //insertar dias
      for(let i=1;i<=diasCantidad;i++){                
        this.fechaLabel.push(formatDate(this.addDaysToDate(selectedFake,i),'yyyy-MM-dd',"en-US"))
      }
    } else if (diasCantidad<=90) {
      //insertar semanas
      for(let i=1;i<=Math.ceil(diasCantidad/7);i++){
        this.fechaLabel.push(formatDate(this.addDaysToDate(fechaInicio,i*7),'yyyy-MM-dd',"en-US")) 
      }
    } else if (new Date(this.date.getFullYear(), 2 + 1, 0).getDay() > 28?366:365) {
      //insertar meses
      for(let i=0;i<=12;i++){
        this.fechaLabel.push(formatDate(this.addDaysToDate(new Date(this.date.getFullYear(), i, 1),
        Number(new Date(this.date.getFullYear(), i + 1, 0).getDay())),'yyyy-MM-dd',"en-US")) 
        
      }
      
    }
  
    this.serviceDash.rangoDeFechas(selectedFake,selectedFake2,5,this.auth.getCveGrupo()).subscribe(async (res : responseService)=>{
      
      if(diasCantidad<=31 && res.container.length > 0){
        dataGrupo = dataGrupoAux  
        grupoCambiar = res.container[0].nombre;      
        for await (const i of res.container) {        
          if(grupoCambiar.toString() === i.nombre.toString()){ 
            /*linea 388 y 395, buscamos el indice que le pertenece a cada dia seleccionado del calendario, para llenarlo
            con sus respectivos tickets*/
            dataGrupo[this.fechaLabel.indexOf(i.fecha) ] = i.totalTicket;
          }else{          
            this.grupos.push({name:grupoCambiar, data:dataGrupo })
            grupoCambiar = i.nombre;  
            dataGrupo = Array<number>(dataGrupo.length).fill(0)          
            dataGrupo[this.fechaLabel.indexOf(i.fecha)] = i.totalTicket;
          }
        }
        this.grupos.push({name:grupoCambiar, data:dataGrupo })
  
      }else if(diasCantidad <=90 && res.container.length> 0 &&diasCantidad>31){
        dataGrupo = dataGrupoAux  
        grupoCambiar = res.container[0].nombre;      
        for await (const i of res.container) {   
          if(grupoCambiar.toString() === i.nombre.toString()){ 
            /**Lo que hacemos en los for await, es agarrar todas las fechas del eje X y las comparamos
             * con las fechas de las consultas, el booleano es para controlar las inserciones y para no
             * insertar en mas fechas/categorias/eje x de la grafica
             */
            for await (const x of this.fechaLabel) {              
            if(new Date(i.fecha).getTime() <= new Date(x).getTime() && pasarForAwait ===false){
  
              dataGrupo[this.fechaLabel.indexOf(x)] +=Number(i.totalTicket) 
              pasarForAwait =true
              }
            }
            pasarForAwait =false
          }else{  
            
            this.grupos.push({name:grupoCambiar, data:dataGrupo })
            grupoCambiar = i.nombre;  
            dataGrupo = Array<number>(dataGrupo.length).fill(0)   
            for await (const x of this.fechaLabel) {  
              if(new Date(i.fecha).getTime() <= new Date(x).getTime() && pasarForAwait ===false){
                dataGrupo[this.fechaLabel.indexOf(x)] +=Number(i.totalTicket)      
                pasarForAwait =true
              }
            }
            pasarForAwait =false
  
         }
        }
  
        this.grupos.push({name:grupoCambiar, data:dataGrupo })
  
  
      }else if(new Date(this.date.getFullYear(), 2 + 1, 0).getDay() > 28?366:365 && res.container.length > 0 && diasCantidad >90){
        pasarForAwait =false
        dataGrupo = dataGrupoAux  
        grupoCambiar = res.container[0].nombre;      
        for await (const i of res.container) {   
          if(grupoCambiar.toString() === i.nombre.toString()){ 
  
           /*Se usaron dos opciones para controlar los insert en el array DataGroup, se decidio usar la
            que no esta comentada, pero se dejo el otro metodo, por si al caso*/
          pasarForAwait =false
           let x =0;
           while (!pasarForAwait) {
            if(new Date(i.fecha).getTime() <= new Date(this.fechaLabel[x]).getTime()){
              dataGrupo[x] +=Number(await i.totalTicket)      
              pasarForAwait =true
              }
              x++;
            }
            /*for await (const x of this.fechaLabel) { 
            if(new Date(i.fecha).getTime() <= new Date(x).getTime() && pasarForAwait ===false){
              dataGrupo[this.fechaLabel.indexOf(x)] +=Number(i.totalTicket) 
              pasarForAwait =true
              }
            }
            pasarForAwait =false
           */ 
            
          }else{  
            this.grupos.push({name:grupoCambiar, data:dataGrupo })
            grupoCambiar = i.nombre;  
            dataGrupo = Array<number>(dataGrupo.length).fill(0)   
            
           /*
            for await (const x of this.fechaLabel) {
              if(new Date(i.fecha).getTime() <= new Date(x).getTime() && pasarForAwait ===false){
                dataGrupo[this.fechaLabel.indexOf(x)] +=Number(i.totalTicket)      
                pasarForAwait =true
              }
            }
            pasarForAwait =false
            */
           let x =0;
           pasarForAwait =false
           while (!pasarForAwait) {
            if(new Date(i.fecha).getTime() <= new Date( this.fechaLabel[x]).getTime()){
              dataGrupo[x] +=Number(await i.totalTicket)      
              pasarForAwait =true
              }
              x++;
            }
         }
        }
        this.grupos.push({name:grupoCambiar, data:dataGrupo })
      }  
      
      this.chartOptionsLine = {
        series: this.grupos,
        chart: {
          height: 350,
          type: "line",
          zoom: {
            enabled: false
          }
        },
        tooltip: {
          shared: false,
          intersect: false,
          followCursor:true,
          x: {
            show: true
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: "straight"
        },
        title: {
          text: "Tickets por departamento",
          align: "left"
        },
        grid: {
          row: {
            colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
            opacity: 0.5
          }
        },
        xaxis: {
          categories: this.fechaLabel,
        },
        yaxis:{
          show:true
        }
      };
        
    })
    
  }

  llenarPieAgentes(selectedFake:string,selectedFake2:string){
    
    this.chartOptionsPieAgentes = {
      dataLabels:{
        enabled: false
      },
      legend:{
        position:"bottom"
      },
      series: [],
      chart: {
        width: 340,
        type: "pie",
         
      },
      labels: [ ],
      title: {
        text: "Tickets de agentes"
      },
      responsive: [
        {
          breakpoint: 1427,
          options: {
            chart: {
              width: 330
            },
            legend: {
              position: "bottom"
            }
          }
        },
        {
          breakpoint: 1100,
          options: {
            chart: {
              width: 320
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
    this.serviceDash.rangoDeFechas(selectedFake,selectedFake2,2,this.auth.getCveGrupo()).subscribe(async(res : responseService)=>{      
      for await (const i of res.container) {
        this.chartOptionsPieAgentes.labels.push(i.nombre)
        this.chartOptionsPieAgentes.series!.push(Number(i.totalTicket))
      }
      if (this.chartOptionsPieAgentes.series!.length == 0) {
        this.chartOptionsPieAgentes.labels.push("No hay agentes este mes")
        this.chartOptionsPieAgentes.series!.push(1)
      }
    })
    
  }

  llenarPieTipos(selectedFake : string,selectedFake2 : string){
    this.tiposTickets = []
    this.chartOptionsPieTipos = {
      dataLabels:{
        enabled: false
      },
      series: [0,0,0,0],
      chart: {
        width: "340",
        type: "pie"
      },
      labels: 
      [
        "No hay tickets",
        "Soporte",
        "Atencion",
        "Solicitud"
      ],
      title: {
        text: "Tipos de tickets"
      },
      responsive: [
        {
          breakpoint: 1427,
          options: {
            chart: {
              width: 320
            },
            legend: {
              position: "bottom"
            }
          }
        },
        {
          breakpoint: 1100,
          options: {
            chart: {
              width: 280
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };

    
    this.serviceDash.rangoDeFechas(selectedFake,selectedFake2,1,this.auth.getCveGrupo()).subscribe(async(res : responseService)=>{
      for await (const i of res.container) {
        this.tiposTickets.push({idTipoTicket:i.idTipoTicket,nombre:i.nombre,totalTicket:i.totalTicket})
      }
          
      this.chartOptionsPieTipos = {
        dataLabels:{
          enabled: false
        },
        series:
        [0,this.tiposTickets[0] !== undefined && this.tiposTickets[0].idTipoTicket === 1? this.tiposTickets[0].totalTicket:
        this.tiposTickets[1] !== undefined && this.tiposTickets[1].idTipoTicket === 1? this.tiposTickets[1].totalTicket:
        this.tiposTickets[2] !== undefined && this.tiposTickets[2].idTipoTicket === 1? this.tiposTickets[2].totalTicket:0
        ,this.tiposTickets[0] !== undefined && this.tiposTickets[0].idTipoTicket === 2? this.tiposTickets[0].totalTicket:
        this.tiposTickets[1] !== undefined && this.tiposTickets[1].idTipoTicket === 2? this.tiposTickets[1].totalTicket:
        this.tiposTickets[2] !== undefined && this.tiposTickets[2].idTipoTicket === 2? this.tiposTickets[2].totalTicket:0
        ,this.tiposTickets[0] !== undefined && this.tiposTickets[0].idTipoTicket === 3? this.tiposTickets[0].totalTicket:
        this.tiposTickets[1] !== undefined && this.tiposTickets[1].idTipoTicket === 3? this.tiposTickets[1].totalTicket:
        this.tiposTickets[2] !== undefined && this.tiposTickets[2].idTipoTicket === 3? this.tiposTickets[2].totalTicket:0] 
    ,
        chart: {
          width: "340",
          type: "pie"
        },
        labels: 
        [
          "No hay tickets",
          "Soporte",
          "Atencion",
          "Solicitud"
        ],
        title: {
          text: "Tipos de tickets"
        },
        responsive: [
          {
            breakpoint: 1427,
            options: {
              chart: {
                width: 320
              },
              legend: {
                position: "bottom"
              }
            }
          },
          {
            breakpoint: 1100,
            options: {
              chart: {
                width: 280
              },
              legend: {
                position: "bottom"
              }
            }
          }
        ]
      };
      this.chartOptionsPieTipos.series![0]=this.chartOptionsPieTipos.series![1]>0?0:
      this.chartOptionsPieTipos.series![2]>0?0:this.chartOptionsPieTipos.series![3]>0?0:1
    }) 
  }


  async pageEvents(event: any) {  
      if(event.previousPageIndex > event.pageIndex) {
      this.inicio = (this.inicio-(this.inicio%6)) - 12;
      console.log(this.inicio);
      
      if(this.inicio < 0){
        this.inicio = 0;
      }
      this.fin =  (this.fin - (this.fin%6)) - 6;
      console.log(this.fin);
      
      await this.cargarSiguientePag();
    } else {
      this.inicio = this.fin;
      console.log(this.fin);

      this.fin = this.fin + 6;
      console.log(this.fin);

      await this.cargarSiguientePag();
    }
  }

  async cargarSiguientePag(){
    /*this.comentario = true
    this.cargando = false;*/
    this.ELEMENT_DATA=[];
    this.dataSource = new MatTableDataSource();
   while (this.inicio < this.fin + 2 && this.inicio < this.tickets.length) {
    if(this.inicio < this.fin){              
      this.ELEMENT_DATA[this.inicio] =  (    
        {
          idTicket:this.tickets[this.inicio].idTicket,
          servicio:this.tickets[this.inicio].servicio,
          fechaAbierta:this.tickets[this.inicio].fechaAbierta,
          fechaCerrada:this.tickets[this.inicio].fechaCerrada,
          grupo:this.tickets[this.inicio].grupo,
          estado:this.tickets[this.inicio].estado,

        });        
      }
    this.inicio++      
    }
    if(this.ELEMENT_DATA.length == 0 ){
      //this.comentario = false;
    }else {
      //this.comentario = true;
    }
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
    this.dataSource.paginator = this.paginator;    
    this.paginator.length =  await this.tickets.length;  
   // this.cargando = true; 
    }


  async llenarListaTickets(selectedFake:string,selectedFake2:string){
    this.serviceDash.rangoDeFechasForm(selectedFake,selectedFake2,0,0,this.auth.getCveGrupo()).subscribe(async(res : responseService)=>{    
    this.ELEMENT_DATA=[];   
    this.tickets =  res.container     
    this.dataSource = new MatTableDataSource();
     while (this.inicio < this.fin + 2 && this.inicio <  this.tickets.length) {
    if(this.inicio < this.fin){              
      this.ELEMENT_DATA[this.inicio] =  (    
        {
          idTicket:res.container[this.inicio].idTicket,
          servicio:res.container[this.inicio].servicio,
          fechaAbierta:res.container[this.inicio].fechaAbierta,
          fechaCerrada:res.container[this.inicio].fechaCerrada,
          grupo:res.container[this.inicio].grupo,
          estado:res.container[this.inicio].estado
        });        
      }
    this.inicio++      
    }    
    if(this.ELEMENT_DATA.length == 0 ){
      //this.comentario = false;
    }else {
      //this.comentario = true;
    }          
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
    this.dataSource.paginator = this.paginator;    
    this.paginator.length =   await res.container.length;        
    })
  }


  hayUsers(){
    if(this.ELEMENT_DATA.length != 0 || this.cargando ==false){
      return true;
    }else{
      return false;
    }
  }
  async llenarListaEmpresas(selectedFake:string,selectedFake2:string){
    this.empresa = []
    this.serviceDash.rangoDeFechas(selectedFake,selectedFake2,3,this.auth.getCveGrupo()).subscribe(async(res : responseService)=>{      
      for await (const i of res.container) {
        this.empresa.push({nombre:i.cliente,totalTicket: i.totalTicket,idCliente:i.cveCliente})
      }
    })
  }

  async llenarListaEstadoTicket(selectedFake:string,selectedFake2:string){
 this.estadoServicio = []    
    this.serviceDash.rangoDeFechas(selectedFake,selectedFake2,4,this.auth.getCveGrupo()).subscribe(async (res : responseService)=>{
      for await (const i of res.container) {
        this.estadoServicio.push({idEstadoTicket:Number(i.idEstadoTicket),estado:i.estado,totalTicket:i.totalTicket})    
      }
      
    })
  }

  complementoCambioFechas(){
    if(this.selectedFake2 === "" || this.selectedFake2 ===undefined){
      this.llenarListaEstadoTicket(this.selectedFake,this.selectedFake)
      this.llenarListaEmpresas(this.selectedFake,this.selectedFake)
      this.llenarListaTickets(this.selectedFake,this.selectedFake)
      this.llenarPieTipos(this.selectedFake,this.selectedFake)
      this.llenarPieAgentes(this.selectedFake,this.selectedFake)
      this.graficaDeLineas(this.selectedFake,this.selectedFake)
      this.graficaDeBarras(this.selectedFake,this.selectedFake)
    }else  if(this.selectedFake === "" || this.selectedFake ===undefined){
        this.llenarListaEstadoTicket(this.selectedFake2,this.selectedFake2)
        this.llenarListaEmpresas(this.selectedFake2,this.selectedFake2)
        this.llenarListaTickets(this.selectedFake2,this.selectedFake2)
        this.llenarPieTipos(this.selectedFake2,this.selectedFake2)
        this.llenarPieAgentes(this.selectedFake2,this.selectedFake2)
        this.graficaDeLineas(this.selectedFake2,this.selectedFake2)
        this.graficaDeBarras(this.selectedFake2,this.selectedFake2)
    }else{
        this.llenarListaEstadoTicket(this.selectedFake,this.selectedFake2)
        this.llenarListaEmpresas(this.selectedFake,this.selectedFake2)
        this.llenarListaTickets(this.selectedFake,this.selectedFake2)
        this.llenarPieTipos(this.selectedFake,this.selectedFake2)
        this.llenarPieAgentes(this.selectedFake,this.selectedFake2) 
        this.graficaDeLineas(this.selectedFake,this.selectedFake2)
        this.graficaDeBarras(this.selectedFake,this.selectedFake2)
    }
  }
  cambiarFecha1(selected : Date){
    let dateNew = new Date(selected);
    this.selectedFake =  formatDate(dateNew,'yyyy-MM-dd',"en-US");    
    this.complementoCambioFechas()
  }

  cambiarFecha2(selected : Date){
    let dateNew = new Date(selected);
    this.selectedFake2 = formatDate(dateNew,'yyyy-MM-dd',"en-US");    
    this.complementoCambioFechas()
  }

  cambiarCalendario(){
    if(this.ocultarDate  === false){
      this.ocultarDate = true
    }else{
      this.ocultarDate = false
    }
  }

  otroCalendario(){
    if(this.oCalendario === false){
      this.oCalendario = true
      this.fechaRango = true;
    }else{
      this.oCalendario = false
      this.selectedFake = ""
      this.selectedFake2 = ""
      this.selected = undefined
      this.selected2 = undefined
      this.ocultarDate = false;
      this.fechaRango = false;
    }
  }


  complementoAbrirForm(){
    if (this.selectedFake.length === 0 && this.selectedFake2.length === 0) {
      this.fecha1 =this.primerDiaString
      this.fecha2 = this.ultimoDiaString
    } else  if(this.selectedFake2 === "" || this.selectedFake2 ===undefined){
      this.fecha1 =this.selectedFake
      this.fecha2 = this.selectedFake
    }else  if(this.selectedFake === ""||  this.selectedFake ===undefined){
      this.fecha1 =this.selectedFake2
      this.fecha2 = this.selectedFake2
    }else{
      this.fecha1 =this.selectedFake
      this.fecha2 = this.selectedFake2
    }
  }

  abrirTopEmpresaTicket(empresa:number,nombreEmpr:string){   
    this.complementoAbrirForm()
    let dialogRef  = this.dialog.open(ViewTicketsEnterpriseComponent,
      {data: {  fecha1:this.fecha1,fecha2:this.fecha2,empresa:empresa,nombre:nombreEmpr},
      animation: { to: "bottom" },
      height:"auto", width:"70%"
     });

    dialogRef.afterClosed().subscribe((result:DeviceModel)=>{
     })
  
  }
  

  abrirEstadoEmpresas(estatus:number){
    this.complementoAbrirForm()
    let dialogRef  = this.dialog.open(ViewEstatusEnterpriseComponent,
      {data: {  fecha1:this.fecha1,fecha2:this.fecha2,estatus:estatus },
      animation: { to: "bottom" },
      height:"auto", width:"70%"
     });

     dialogRef.afterClosed().subscribe((result:DeviceModel)=>{
     })
  
  }

  addDaysToDate(date:any, days:any) : Date{
    var res = new Date(date);
    res.setDate(res.getDate() + days);
    return res;
  }
}