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

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements  AfterViewInit {
    private readonly notifier: NotifierService;

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
    array: string[] = [];
    filteredOptions: Observable<string[]> | undefined;

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
        const filterValue = value.toLowerCase();
        return this.options.filter(option => option.toLowerCase().includes(filterValue));
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

    async servicio(id:string,event : any){
        id = id.split(" ")[0]

        if(event.key !== "tab" && event.key !=="ArrowUp" && event.key !=="ArrowDown"
        && event.key !=="ArrowLeft" && event.key !=="ArrowRight" && event.key !=="Enter" 
        && (id.replace(/[0-9]*\gi/,"")).length == 1  || id == "" || Number(id) > 0){
          await lastValueFrom(this.Search.searchTicketEntry(id,1)).then( (result : responseService) =>{
          if(result.status !== "not found"){
          this.options= result.container;
          }else{
            this.options=[]
          }
        });
    
        this.filteredOptions = this.myControl.valueChanges.pipe(
          startWith(''),
          map((value: any) =>  this._filter(value || '')) );
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
