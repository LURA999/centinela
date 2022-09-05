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

 interface topAgente {
  nombre: string;
  empresa: string;
  totalTicket: number;
}

 interface estadoServicio {
  nombre: string;
  empresa: string;
  totalTicket: number;
}


interface tickets {
  idTicket: number;
  asunto:string;
  descripcion:string;
  tipo:string;
}

@Component({
  selector: 'app-dashboard-tickets',
  templateUrl: './dashboard-tickets.component.html',
  styleUrls: ['./dashboard-tickets.component.css']
})
export class DashboardTicketsComponent implements OnInit,AfterViewInit,OnDestroy {
  selected : Date | undefined;
  selected2 : Date | undefined;
  
  selectedFake : String ="";
  selectedFake2 : String ="";

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
  agente: topAgente[] = [ ];
  estadoServicio: estadoServicio[] = [ ];
  tickets: tickets [] = [];


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
    this.serviceDash.rangoDeFechas(this.primerDiaString,this.ultimoDiaString,6).subscribe((res : responseService)=>{
      console.log(res.container); 
    })
    this.chartOptionsBar! = {
      title:{
        text:"Servicios con mas tickets"
      },
      series: [
        {
          name: "Net Profit",
          data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
        },
        {
          name: "Revenue",
          data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
        },
        {
          name: "Free Cash Flow",
          data: [35, 41, 36, 26, 45, 48, 52, 53, 41]
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
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct"
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
  }


  graficaDeLineas(){
    this.serviceDash.rangoDeFechas(this.primerDiaString,this.ultimoDiaString,5).subscribe((res : responseService)=>{
      console.log(res.container); 
    })
    this.chartOptionsLine = {
      series: [
        {
          name: "Desktops",
          data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
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
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep"
        ]
      }
    };
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
    this.serviceDash.rangoDeFechas(this.primerDiaString,this.ultimoDiaString,2).subscribe((res : responseService)=>{
      console.log(res.container); 
    })
    this.chartOptionsPieAgentes = {
      dataLabels:{
        enabled: false
      },
      series: [25, 15, 44, 55, 41, 17],
      chart: {
        width: 340,
        type: "pie"
      },
      labels: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
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
  }

  llenarPieTipos(){
    this.serviceDash.rangoDeFechas(this.primerDiaString,this.ultimoDiaString,1).subscribe((res : responseService)=>{
      console.log(res.container); 
    })
    this.chartOptionsPieTipos = {
      dataLabels:{
        enabled: false
      },
      series: [25, 15, 44, 55, 41, 17],
      chart: {
        width: "340",
        type: "pie"
      },
      labels: 
      [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
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
     /* for await (const iterator of object) {
        
      }*/
      console.log(res.container); 
    })
    this.estadoServicio.push({empresa:"la mejor",nombre:"servicio 1",totalTicket: 3})
    this.estadoServicio.push({empresa:"la mejor",nombre:"servicio 2",totalTicket: 3})
    this.estadoServicio.push({empresa:"la mejor",nombre:"servicio 3",totalTicket: 3})
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
