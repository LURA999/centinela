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
import { data } from 'jquery';

export type ChartOptionsLine = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  toolbar:ApexTooltip,
  yaxis:ApexYAxis,
  tooltip:ApexTooltip

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
 
  fechaLabel:string[]=[]
  selected : Date | undefined;
  selected2 : Date | undefined;
  
  selectedFake : string ="";
  selectedFake2 : string ="";


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

  graficaDeBarras(primerDiaString:string,ultimoDiaString:string){
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

    this.serviceDash.rangoDeFechas(primerDiaString, ultimoDiaString,6).subscribe(async (res : responseService)=>{
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


  graficaDeLineas(selectedFake:string,selectedFake2:string){
  this.grupos = []
  this.fechaLabel = []
  var fechaInicio :Date = new Date(selectedFake)
  var fechaFin  :Date  = new Date(selectedFake2);
  var diff = fechaFin.getTime() - fechaInicio.getTime();
  let cantidadMeses :number = Number(fechaFin.getMonth()) + Number(fechaInicio.getMonth())
  console.log("meses "+cantidadMeses+" fechaFin "+Number(fechaFin.getMonth())+", fechaInicio "+Number(fechaInicio.getMonth()));
   
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
  console.log(dataGrupoAux);

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
    console.log(this.fechaLabel);
    
  }

  this.serviceDash.rangoDeFechas(selectedFake,selectedFake2,5).subscribe(async (res : responseService)=>{
    
    if(diasCantidad<=31 && res.container.length > 0){
      dataGrupo = dataGrupoAux  
      grupoCambiar = res.container[0].nombre;      
      for await (const i of res.container) {        
        if(grupoCambiar.toString() === i.nombre.toString()){ 
          /*linea 375 y 381, buscamos el indice que le pertenece a cada dia seleccionado del calendario, para llenarlo
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
           * con las fechas de las consultas, el booleano, es para controlar las inseciones y para no
           * insertar en mas fechas/categorias/eje x de la grafica
           */
          for await (const x of this.fechaLabel) {
            console.log(new Date(i.fecha).getTime()+" <= "+new Date(x).getTime());
            
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
            console.log(i.fecha+" <= "+x);

            console.log(new Date(i.fecha).getTime()+" <= "+new Date(x).getTime());

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
      console.log(dataGrupoAux);
      
      dataGrupo = dataGrupoAux  
      grupoCambiar = res.container[0].nombre;      
      for await (const i of res.container) {   
        if(grupoCambiar.toString() === i.nombre.toString()){ 
          
          for await (const x of this.fechaLabel) {
            console.log(i.fecha+" <= "+x);

            console.log(new Date(i.fecha).getTime() +" <= "+ new Date(x).getTime());
            console.log(new Date(i.fecha).getTime() <= new Date(x).getTime());
            
          if(new Date(i.fecha).getTime() <= new Date(x).getTime() && pasarForAwait ===false){
            dataGrupo[this.fechaLabel.indexOf(x)] +=Number(i.totalTicket) 
            pasarForAwait =true
            console.log("entro");
            console.log(dataGrupo);
            
            }
          }
          pasarForAwait =false
          
        }else{  
          this.grupos.push({name:grupoCambiar, data:dataGrupo })
          grupoCambiar = i.nombre;  
          dataGrupo = Array<number>(dataGrupo.length).fill(0)   
          for await (const x of this.fechaLabel) {
            console.log(i.fecha+" <= "+x);

            console.log(new Date(i.fecha).getTime() +" <= "+ new Date(x).getTime());
            console.log(new Date(i.fecha).getTime() <= new Date(x).getTime());
            if(new Date(i.fecha).getTime() <= new Date(x).getTime() && pasarForAwait ===false){
              
              dataGrupo[this.fechaLabel.indexOf(x)] +=Number(i.totalTicket)      
              pasarForAwait =true
              console.log("entro");
              console.log(dataGrupo);
              
            }
          }
          pasarForAwait =false

       }
      }

      this.grupos.push({name:grupoCambiar, data:dataGrupo })

    }  
    console.log(dataGrupo);
    
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

  //min2 :Date = new Date("2022-09-30");
 // min :Date = this.addDaysToDate(this.min2,5)
   addDaysToDate(date:any, days:any) : Date{
    var res = new Date(date);
    res.setDate(res.getDate() + days);
    return res;
  }
  constructor(private breakpointObserver: BreakpointObserver,mediaMatcher: MediaMatcher,
    private dataService:DataLayoutService, private serviceDash : dashboardTicketsService) {
     

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

  llenarPieAgentes(selectedFake:string,selectedFake2:string){
    
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
    this.serviceDash.rangoDeFechas(selectedFake,selectedFake2,2).subscribe(async(res : responseService)=>{      
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

  llenarPieTipos(selectedFake:string,selectedFake2:string){
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

    
    this.serviceDash.rangoDeFechas(selectedFake,selectedFake2,1).subscribe(async(res : responseService)=>{
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

  async llenarListaTickets(selectedFake:string,selectedFake2:string){
    this.tickets = []
    this.serviceDash.rangoDeFechas(selectedFake,selectedFake2,7).subscribe((res : responseService)=>{
    })
    this.tickets.push({idTicket:3,asunto:"VPN",descripcion:"este es un ticket",tipo:"Solicitud"})
    this.tickets.push({idTicket:4,asunto:"Tunel",descripcion:"es otro ticket",tipo:"Atencion"})
    this.tickets.push({idTicket:5,asunto:"Control de radios",descripcion:"otro tro tickeet",tipo:"Soporte"})
  }
  async llenarListaEmpresas(selectedFake:string,selectedFake2:string){
    this.empresa = []
    this.serviceDash.rangoDeFechas(selectedFake,selectedFake2,3).subscribe((res : responseService)=>{
    })
    this.empresa.push({nombre:"la mejor ",totalTicket: 3})
    this.empresa.push({nombre:"la mejor ",totalTicket: 3})
    this.empresa.push({nombre:"lamejor ",totalTicket: 3})
  }

  async llenarListaEstadoTicket(primerDiaString:string,ultimoDiaString:string){
    this.estadoServicio = []
    this.serviceDash.rangoDeFechas(primerDiaString,ultimoDiaString,4).subscribe(async (res : responseService)=>{
      for await (const iterator of res.container) {
        this.estadoServicio.push({idEstadoTicket:Number(res.container[0].idEstadoTicket),estado:res.container[0].estado,totalTicket:res.container[0].totalTicket})    
      }
    })
  }

  cambiarFecha1(selected : Date){

    let dateNew = new Date(selected);
    this.selectedFake =  formatDate(dateNew,'yyyy-MM-dd',"en-US");   
    
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

  cambiarFecha2(selected : Date){
    let dateNew = new Date(selected);
    this.selectedFake2 = formatDate(dateNew,'yyyy-MM-dd',"en-US");    

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