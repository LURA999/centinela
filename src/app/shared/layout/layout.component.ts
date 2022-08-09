import { Component, OnInit, ChangeDetectorRef, OnDestroy, AfterViewInit, Input } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import {  lastValueFrom, Observable, Observer, Subscription } from 'rxjs';
import { startWith,map } from 'rxjs/operators';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { ConfigService } from 'src/app/core/services/config.service';
import { FormControl } from '@angular/forms';
import { SearchService } from 'src/app/core/services/search.service';
import { NotifierService } from 'angular-notifier';
import { responseService } from 'src/app/models/responseService.model';
import { RepeteadMethods } from 'src/app/pages/RepeteadMethods';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.css']
})

export class LayoutComponent implements OnInit, AfterViewInit {
    booleantodos:boolean=true
    booleanservicio:boolean=true
    booleancontactos:boolean=true
    booleantickets:boolean=true
    mostrar:string="on"
    metodos = new RepeteadMethods();
    private readonly notifier: NotifierService;
    serviciosbooleanlabel:boolean=false
    contactosbooleanlabel:boolean=false
    ticketsbooleanlabel:boolean=false
    botontodos:boolean=true
    botonservicio:boolean=false
    botoncontacto:boolean=false
    botontickets:boolean=false
    cargando : boolean=false

    time = new Observable<string>((observer: Observer<string>) => {
        setInterval(() => observer.next(
            new Date().toTimeString().split(" ")[0]), 1000);
    });    
    
    private _mobileQueryListener: () => void;
    mobileQuery: MediaQueryList;
    showSpinner: boolean = false;
    userName: string = "";
    isAdmin: boolean = false;
    private autoLogoutSubscription: Subscription = new Subscription;
   
    logo:any
    myControl = new FormControl('');
    options: string[] = [];
    contacts:string[]=[]
    tickets:string[]=[]

    array: string[] = [];
    filteredOptions: Observable<string[]> | undefined;
    filteredContacts: Observable<string[]> | undefined;
    filteredTickets: Observable<string[]> | undefined;

    constructor( 
        notifierService: NotifierService,
       private auth : AuthService,
        private changeDetectorRef: ChangeDetectorRef,
        private media: MediaMatcher,
        private router : Router,
        private configservice:ConfigService,
        private Search:SearchService
        
      ) {
        this.notifier = notifierService;
        this.mobileQuery = this.media.matchMedia('(max-width: 1000px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        // tslint:disable-next-line: deprecation
        this.mobileQuery.addListener(this._mobileQueryListener);
    }

    ngOnInit(): void {
          
        // tslint:disable-next-line: deprecation
        this.mobileQuery.removeListener(this._mobileQueryListener);
        this.autoLogoutSubscription.unsubscribe();
        lastValueFrom(this.configservice.llamarEmpresa()).then( (result : any) =>{
        this.logo=result.container[0]["logo"]
        });    
    }

    acceso(){
        if(this.auth.getCveRol() == 4){
            return "none"
        }else{
            return "block"
        }  
    }


    ngAfterViewInit(): void {
        this.changeDetectorRef.detectChanges();
    }

    private _filter(value: string): string[] {
        const filterValue :string= value.toLowerCase();
        return this.options.filter((option :string) => option.toLowerCase().includes(filterValue));
      }

      private _filterContacts(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.contacts.filter((option :string) => option.toLowerCase().includes(filterValue));
      }
       private _filterTickets(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.tickets.filter((option :string) => option.toLowerCase().includes(filterValue));
      }

    salir(){
        if(this.auth.getTipo()==1){
            this.auth.cerrarSesion();
            this.router.navigateByUrl("/admin");
        }else{
            this.auth.cerrarSesion();
            this.router.navigateByUrl("/usuario");
        }
    }



    
  

    todosbutton(id:string,event : any){
this.botontodos=true

this.botonservicio=false
this.botoncontacto=false
this.botontickets=false

  this.servicio(id,event);
  this.contacto(id,event);
  this.ticket(id,event);

    }

serviciobutton(id:string,event : any){

  this.botontodos=false

   if(this.botoncontacto==false){
    this.filteredContacts = new FormControl('').valueChanges;
   }

   if(this.botontickets==false){
    this.filteredTickets = new FormControl('').valueChanges;

   }

   if(this.botonservicio==false){
    this.botonservicio=true
    this.servicio(id,event);
   
   }else{
    this.filteredOptions = new FormControl('').valueChanges;
    this.botonservicio=false
    console.log("servicio es true");
   }


   
}
contactobutton(id:string,event : any){
  this.botontodos=false

  if(this.botonservicio==false){
    this.filteredOptions = new FormControl('').valueChanges;
   }
   if(this.botontickets==false){
    this.filteredTickets = new FormControl('').valueChanges;
   }
   if(this.botoncontacto==false){
    this.botoncontacto=true
    console.log(this.botoncontacto+"contacto");
    this.contacto(id,event);
   

   }else{
    this.filteredContacts = new FormControl('').valueChanges;
    this.botoncontacto=false

    console.log("servicio es true");

   }
}

ticketbutton(id:string,event : any){
  this.botontodos=false

  if(this.botonservicio==false){
    this.filteredOptions = new FormControl('').valueChanges;

   }

   if(this.botoncontacto==false){
    this.filteredContacts = new FormControl('').valueChanges;

   }

   if(this.botontickets==false){
    this.botontickets=true
    this.ticket(id,event);
 

   }else{
    this.filteredTickets = new FormControl('').valueChanges;
    this.botontickets=false

    console.log("servicio es true");

   }
}

    async servicio(id:string,event : any){
      this.cargando=true
      
if(this.botonservicio==true||this.botontodos==true){
        
        id = id.split(" ")[0]

        if(event.key !== "tab" && event.key !=="ArrowUp" && event.key !=="ArrowDown"
        && event.key !=="ArrowLeft" && event.key !=="ArrowRight" && event.key !=="Enter" 

        || id == "" || Number(id) > 0){
          await lastValueFrom(this.Search.searchService(id)).then( (result : responseService) =>{

          if(result.status !== "not found"){
            this.serviciosbooleanlabel=true
          
          this.options= result.container;
          console.log(this.options);
          
          }else{
            this.serviciosbooleanlabel=false
            this.options=[]
           
            
          }
        });

        this.filteredOptions = this.myControl.valueChanges.pipe(
          
          startWith(''),
          map((value: any) =>  this._filter(value || '')) );
        }

    }else{
        this.serviciosbooleanlabel=false
        this.options=[]
    }
    this.cargando=false


    }






    async contacto(id:string,event : any){


        if(this.botoncontacto==true||this.botontodos==true){
        id = id.split(" ")[0]

        if(event.key !== "tab" && event.key !=="ArrowUp" && event.key !=="ArrowDown"
        && event.key !=="ArrowLeft" && event.key !=="ArrowRight" && event.key !=="Enter" 
        || id == "" || Number(id) > 0){
          await lastValueFrom(this.Search.searchContact(id)).then( (result : responseService) =>{
          if(result.status !== "not found"){
            this.contactosbooleanlabel=true
          this.contacts= result.container;
          console.log(this.contacts);
          
          }else{
            this.contactosbooleanlabel=false
            this.contacts=[]
          }
        });
        this.filteredContacts = this.myControl.valueChanges.pipe(
          startWith(''),
          map((value: any) =>  this._filterContacts(value || '')) );
        }
        }else{
            this.contactosbooleanlabel=false
            this.contacts=[]  
        }


    }





    async ticket(id:string,event : any){
        if(this.botontickets==true||this.botontodos==true){
        id = id.split(" ")[0]

        if(event.key !== "tab" && event.key !=="ArrowUp" && event.key !=="ArrowDown"
        && event.key !=="ArrowLeft" && event.key !=="ArrowRight" && event.key !=="Enter" 
        || id == "" || Number(id) > 0){
          await lastValueFrom(this.Search.searchTicket(id)).then( (result : responseService) =>{
            console.log(result);
            
          if(result.status !== "not found"){
            this.ticketsbooleanlabel=true
          this.tickets= result.container;
          }else{
            console.log("entra");
            
            this.ticketsbooleanlabel=false
            this.tickets=[]
            
          }
        });
        this.filteredTickets = this.myControl.valueChanges.pipe(
          startWith(''),
          map((value: any) =>  this._filterTickets(value || '')) );

        }
    }else{
        this.ticketsbooleanlabel=false
            this.tickets=[]
    }
    }


    async irServicio (id : string){
        console.log(id);
        
        await lastValueFrom(this.Search.llamarServicioEstatus(this.options.indexOf(id)+1)).then( (result : any) =>{
           console.log(result);
           
            var estatus=result.container[0]["estatus"]
        
            if(estatus!=2){
                id = id.split(" ")[0]
                var identificador=id.replace(/([0-9]{4})\S/,"");
                identificador= identificador.substring(0,identificador.length-1)
                
                this.router.navigateByUrl("/admin/client/"+identificador+"/"+id).then(() => {
                    window.location.reload();
                  });
                 
                     
                } else{
                    this.notifier.notify('warning', 'Servicio Inactivo');    
                
                }     
            }); 
    }
}
