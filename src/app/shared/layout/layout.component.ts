import { Component, OnInit, ChangeDetectorRef, OnDestroy, AfterViewInit, ViewChild, ElementRef, Input } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import {  Observable, Observer, OperatorFunction, Subscription } from 'rxjs';
import { startWith,map, filter } from 'rxjs/operators';
import { AuthService } from 'src/app/core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigService } from 'src/app/core/services/config.service';
import { FormControl } from '@angular/forms';
import { SearchService } from 'src/app/core/services/search.service';
import { splitAtColon } from '@angular/compiler/src/util';
import { NotifierService } from 'angular-notifier';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit, OnDestroy, AfterViewInit {
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
        
let i=0;
        this.Search.llamarServicio().toPromise().then( (result : any) =>{
            for(i=0;i<result.container.length;i++){
           
       
         
            
              
   this.array.push(result.container[i]["servicio"])
            } 
      this.options=this.array
     
     
      
             })
            
             
             ;   


       
        this.filteredOptions = this.myControl.valueChanges.pipe(
            startWith(''),
            map(value =>  this._filter(value || '')),
          );
          
        // tslint:disable-next-line: deprecation
        this.mobileQuery.removeListener(this._mobileQueryListener);
        this.autoLogoutSubscription.unsubscribe();
    
       this.configservice.llamarEmpresa().toPromise().then( (result : any) =>{
            
            this.logo=result.container[0]["logo"]
             })
             ;    

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

    salir(){

        if(this.auth.getTipo()==1){
            this.auth.cerrarSesion();
            this.router.navigateByUrl("/admin");
        }else{
            this.auth.cerrarSesion();
            this.router.navigateByUrl("/usuario");
        }
    }
    servicio(id:string){
this.Search.llamarServicioEstatus(this.options.indexOf(id)+1).toPromise().then( (result : any) =>{
     var estatus=result.container[0]["estatus"]
    
     


if(estatus!=2){
    console.log(estatus);
    


var identificador=id.replace(/([0-9]{4})\S/,"");
  identificador= identificador.substring(0,identificador.length-1)


  this.router.navigate(["/admin/client/"+identificador+"/"+id])
 
        
} else{
    this.notifier.notify('warning', 'Servicio Inactivo');

}     
}); 
    }
   
    
   
}
