import { Component, OnInit, ChangeDetectorRef, OnDestroy, AfterViewInit, ViewChild, ElementRef, Input } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { ConfigService } from 'src/app/core/services/config.service';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit, OnDestroy, AfterViewInit {
    now: Date | undefined;
    private _mobileQueryListener: () => void;
    mobileQuery: MediaQueryList;
    showSpinner: boolean = false;
    userName: string = "";
    isAdmin: boolean = false;
    private autoLogoutSubscription: Subscription = new Subscription;
logo:any


    constructor( 
       private auth : AuthService,
        private changeDetectorRef: ChangeDetectorRef,
        private media: MediaMatcher,
        private router : Router,
        private configservice:ConfigService,
      ) {
Image
        this.mobileQuery = this.media.matchMedia('(max-width: 1000px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        // tslint:disable-next-line: deprecation
        this.mobileQuery.addListener(this._mobileQueryListener);

    }

    ngOnInit(): void {
       
        this.now = new Date();
 
        setInterval(() => {
     
          this.now = new Date();
     
        }, 1000);
    
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
        // tslint:disable-next-line: deprecation
        this.mobileQuery.removeListener(this._mobileQueryListener);
        this.autoLogoutSubscription.unsubscribe();
    }

    ngAfterViewInit(): void {
        this.changeDetectorRef.detectChanges();
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
    
   
    
   
}
