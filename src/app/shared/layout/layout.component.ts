import { Component, OnInit, ChangeDetectorRef, OnDestroy, AfterViewInit } from '@angular/core';
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
import { stringToKeyValue } from '@angular/flex-layout/extended/style/style-transforms';
import { MatAutocomplete } from '@angular/material/autocomplete';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit, OnDestroy, AfterViewInit {
    mostrar:string="on"
    private readonly notifier: NotifierService;
serviciosboolean:boolean=false
contactosboolean:boolean=false
ticketsboolean:boolean=false
botontodos:boolean=true
botonservicio:boolean=true
botoncontacto:boolean=true
botontickets:boolean=true


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
    ngOnDestroy(): void {
    }

    ngAfterViewInit(): void {
        this.changeDetectorRef.detectChanges();
    }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.options.filter(option => option.toLowerCase().includes(filterValue));
      }

      private _filterContacts(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.contacts.filter(option => option.toLowerCase().includes(filterValue));
      }
       private _filterTickets(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.tickets.filter(option => option.toLowerCase().includes(filterValue));
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



    
    

    todosbutton(){
        this.botonservicio=true
        this.botoncontacto=true
        this.botontickets=true
       
    }

serviciobutton(){
    this.botonservicio=true
    this.botoncontacto=false
    this.botontickets=false
    this.contacts=[]
    this.tickets=[]
   
}
contactobutton(){
    this.botoncontacto=true
    this.botonservicio=false
    this.botontickets=false
    this.options=[]
    this.tickets=[]
}
ticketbutton(){
    this.botontickets=true
    this.botoncontacto=false
    this.botonservicio=false
    this.contacts=[]
    this.options=[]
}

    async servicio(id:string,event : any){
if(this.botonservicio==true){
        
        id = id.split(" ")[0]

        if(event.key !== "tab" && event.key !=="ArrowUp" && event.key !=="ArrowDown"
        && event.key !=="ArrowLeft" && event.key !=="ArrowRight" && event.key !=="Enter" 
        || id == "" || Number(id) > 0){
          await lastValueFrom(this.Search.searchService(id)).then( (result : responseService) =>{
          if(result.status !== "not found"){
            this.serviciosboolean=true
          console.log(result.container);
          
          this.options= result.container;
          }else{
            this.serviciosboolean=false
            this.options=[]
           
            
          }
        });

        this.filteredOptions = this.myControl.valueChanges.pipe(
          startWith(''),
          map((value: any) =>  this._filter(value || '')) );
        }
    }else{
        this.serviciosboolean=false
        this.options=[]
    }

    }






    async contacto(id:string,event : any){

        if(this.botoncontacto==true){
        id = id.split(" ")[0]

        if(event.key !== "tab" && event.key !=="ArrowUp" && event.key !=="ArrowDown"
        && event.key !=="ArrowLeft" && event.key !=="ArrowRight" && event.key !=="Enter" 
        || id == "" || Number(id) > 0){
          await lastValueFrom(this.Search.searchContact(id)).then( (result : responseService) =>{
          if(result.status !== "not found"){
            this.contactosboolean=true
          this.contacts= result.container;
          }else{
            this.contactosboolean=false
            this.contacts=[]
          }
        });
        this.filteredContacts = this.myControl.valueChanges.pipe(
          startWith(''),
          map((value: any) =>  this._filterContacts(value || '')) );
        }
        }else{
            this.contactosboolean=false
            this.contacts=[]  
        }


    }





    async ticket(id:string,event : any){
        if(this.botontickets==true){
        id = id.split(" ")[0]

        if(event.key !== "tab" && event.key !=="ArrowUp" && event.key !=="ArrowDown"
        && event.key !=="ArrowLeft" && event.key !=="ArrowRight" && event.key !=="Enter" 
        || id == "" || Number(id) > 0){
          await lastValueFrom(this.Search.searchTicket(id)).then( (result : responseService) =>{
            console.log(result);
            
          if(result.status !== "not found"){
            this.ticketsboolean=true
          this.tickets= result.container;
          }else{
            console.log("entra");
            
            this.ticketsboolean=false
            this.tickets=[]
            
          }
        });
        this.filteredTickets = this.myControl.valueChanges.pipe(
          startWith(''),
          map((value: any) =>  this._filterTickets(value || '')) );

        }
    }else{
        this.ticketsboolean=false
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
