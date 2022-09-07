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

export type ChartOptionsLine = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  toolbar:ApexTooltip
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
};

 interface topEmpresa {
  nombre: string;
  totalTicket: number;
}
interface grupo{
name:string
data :number[]
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
  asunto:string;
  descripcion:string;
  tipo:string;
}

interface servicioTicket {
  idServicio?: number,
  nombre: string,
  totalTicket: number
}

@Component({
  selector: 'app-dashboard-tickets',
  templateUrl: './dashboard-tickets.component.html',
  styleUrls: ['./dashboard-tickets.component.css']
})
export class DashboardTicketsComponent implements OnInit,AfterViewInit,OnDestroy {
 
  dias:string[]=[]
  semanas:string[]=[]
  meses:string[]=[]
name:string=""
  selected : Date | undefined;
  selected2 : Date | undefined;
  
  selectedFake : String ="";
  selectedFake2 : String ="";


  grupos: grupo[]=[]

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
  tickets: tickets [] = [];
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

  graficaDeBarras(){
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

    this.serviceDash.rangoDeFechas(this.primerDiaString,this.ultimoDiaString,6).subscribe(async (res : responseService)=>{
      let totalTickets : number []= []
      let categorias : string []= []
      let fecha : string []= []
      let estructura : any []= []

//      categorias.push(this.primerDiaString)
  //    totalTickets.push(0)
      for await (const i of res.container) {
        totalTickets.push(i.totalTicket)
        categorias.push(i.nombre)
        fecha.push(i.fecha)
        this.servicioTicket.push(i)
        estructura.push({
          x:i.fecha,
          y:i.totalTicket,
          goals:[
            {
            name:"Servicio: ",
            value:i.nombre,
            strokeColor:"transparent",
            },{
            name:"Fecha: ",
            value:i.fecha,
            strokeColor:"transparent",
            }
          ]
        })
      }
    //  totalTickets.push(0)
    //  categorias.push(this.ultimoDiaString)

      console.log(totalTickets);
      
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
            text:"FILA X"
          },
          categories: categorias,
        },
        yaxis: {
          title: {
            text: "FILA Y"
          }
        },
        fill: {
          opacity: 1
        }
        
      };
  
    })
  }


  graficaDeLineas(){
 

var fecha=1
    if(fecha==1){
      for(let i=0;i<7;i++){
      
    
        this.grupos.push({name:"Administrador"+i, data:[] })
        }
        console.log(this.grupos);
        
      
      //Chartoption para dias
      for(let i=1;i<=30;i++){
        this.dias.push(i+"")
      
      
      this.serviceDash.rangoDeFechas(this.primerDiaString,this.ultimoDiaString,5).subscribe(async (res : responseService)=>{
        //aqui va el if//
       this.chartOptionsLine = {
         series: this.grupos,
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
           categories: this.dias
         }
       };
     })
      
      
      }
        }else if(fecha ==2)
        //Chartoption para semanas
        {
          console.log("Entra");
          
          for(let i=1;i<=12;i++){
            this.semanas.push(i+"")
            }


            this.serviceDash.rangoDeFechas(this.primerDiaString,this.ultimoDiaString,5).subscribe(async (res : responseService)=>{
              //aqui va el if//
             this.chartOptionsLine = {
               series: [
                 
                   {
                     name: "Administracion:",
                     data:[1,10,15,1,10,15,10,15,1,10,15,10]
                   },
                   {
                     name: "Soporte:",
                     data:[2,3,22,1,10,15,10,15,1,43,15,10]
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
                 categories: this.semanas
               }
             };
           })




        }else if(fecha==3){
//Chartoption para meses
          for(let i=1;i<=12;i++){
            this.meses.push(i+"")
            }

            this.serviceDash.rangoDeFechas(this.primerDiaString,this.ultimoDiaString,5).subscribe(async (res : responseService)=>{
              //aqui va el if//
             this.chartOptionsLine = {
               series: [
                 
                   {
                     name: "Administracion:",
                     data:[1,10,15,1,10,15,10,15,1,10,15,10]
                   },
                   {
                     name: "Soporte:",
                     data:[2,3,22,1,10,15,10,15,1,43,15,10]
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
                 categories: this.meses
               }
             };
           })

        }

    

   
  }


  constructor(private breakpointObserver: BreakpointObserver,mediaMatcher: MediaMatcher,
    private dataService:DataLayoutService, private serviceDash : dashboardTicketsService) {
    this.graficaDeLineas()
    this.graficaDeBarras()

      

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
    this.llenarListaEstadoTicket()
    this.llenarListaEmpresas()
    this.llenarListaTickets()
    this.llenarPieTipos()
    this.llenarPieAgentes()
  }

  llenarPieAgentes(){
    
    this.chartOptionsPieAgentes = {
      dataLabels:{
        enabled: false
      },
      series: [ ],
      chart: {
        width: 340,
        type: "pie"
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
    this.serviceDash.rangoDeFechas(this.primerDiaString,this.ultimoDiaString,2).subscribe(async(res : responseService)=>{      
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

  llenarPieTipos(){

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

    
    this.serviceDash.rangoDeFechas(this.primerDiaString,this.ultimoDiaString,1).subscribe(async(res : responseService)=>{
      for await (const i of res.container) {
        this.tiposTickets.push({idTipoTicket:i.idTipoTicket,nombre:i.nombre,totalTicket:i.totalTicket})
      }
      
    this.chartOptionsPieTipos.series= 
    [0,this.tiposTickets[0] !== undefined && this.tiposTickets[0].idTipoTicket === 1? this.tiposTickets[0].totalTicket:
    this.tiposTickets[1] !== undefined && this.tiposTickets[1].idTipoTicket === 1? this.tiposTickets[1].totalTicket:
    this.tiposTickets[2] !== undefined && this.tiposTickets[2].idTipoTicket === 1? this.tiposTickets[2].totalTicket:0
    ,this.tiposTickets[0] !== undefined && this.tiposTickets[0].idTipoTicket === 2? this.tiposTickets[0].totalTicket:
    this.tiposTickets[1] !== undefined && this.tiposTickets[1].idTipoTicket === 2? this.tiposTickets[1].totalTicket:
    this.tiposTickets[2] !== undefined && this.tiposTickets[2].idTipoTicket === 2? this.tiposTickets[2].totalTicket:0
    ,this.tiposTickets[0] !== undefined && this.tiposTickets[0].idTipoTicket === 3? this.tiposTickets[0].totalTicket:
    this.tiposTickets[1] !== undefined && this.tiposTickets[1].idTipoTicket === 3? this.tiposTickets[1].totalTicket:
    this.tiposTickets[2] !== undefined && this.tiposTickets[2].idTipoTicket === 3? this.tiposTickets[2].totalTicket:0] 

    this.chartOptionsPieTipos.series[0]=this.chartOptionsPieTipos.series[1]>0?0:
    this.chartOptionsPieTipos.series[2]>0?0:this.chartOptionsPieTipos.series[3]>0?0:1
    
    }) 
  }

  async llenarListaTickets(){
    this.serviceDash.rangoDeFechas(this.primerDiaString,this.ultimoDiaString,7).subscribe((res : responseService)=>{
      console.log(res.container); 
    })
    this.tickets.push({idTicket:3,asunto:"VPN",descripcion:"este es un ticket",tipo:"Solicitud"})
    this.tickets.push({idTicket:4,asunto:"Tunel",descripcion:"es otro ticket",tipo:"Atencion"})
    this.tickets.push({idTicket:5,asunto:"Control de radios",descripcion:"otro tro tickeet",tipo:"Soporte"})
  }
  async llenarListaEmpresas(){
    this.serviceDash.rangoDeFechas(this.primerDiaString,this.ultimoDiaString,3).subscribe((res : responseService)=>{
      console.log(res.container); 
    })
    this.empresa.push({nombre:"la mejor ",totalTicket: 3})
    this.empresa.push({nombre:"la mejor ",totalTicket: 3})
    this.empresa.push({nombre:"lamejor ",totalTicket: 3})
  }

  async llenarListaEstadoTicket(){
    this.serviceDash.rangoDeFechas(this.primerDiaString,this.ultimoDiaString,4).subscribe(async (res : responseService)=>{
      for await (const iterator of res.container) {
        this.estadoServicio.push({idEstadoTicket:Number(res.container[0].idEstadoTicket),estado:res.container[0].estado,totalTicket:res.container[0].totalTicket})    
      }
    })
  }

  cambiarFecha1(selected : Date){
    let dateNew = new Date(selected);
    this.selectedFake =  formatDate(dateNew,'yyyy-MM-dd',"en-US");    
  }

  cambiarFecha2(selected : Date){
    let dateNew = new Date(selected);
    this.selectedFake2 = formatDate(dateNew,'yyyy-MM-dd',"en-US");    
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
      this.ocultarDate = false;
      this.fechaRango = false;

    }
  }

}