import { Component, OnInit, ChangeDetectorRef, OnDestroy, AfterViewInit, ViewChild, ElementRef, Input } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit, OnDestroy, AfterViewInit {

    private _mobileQueryListener: () => void;
    mobileQuery: MediaQueryList;
    showSpinner: boolean = false;
    userName: string = "";
    isAdmin: boolean = false;
    private autoLogoutSubscription: Subscription = new Subscription;

    constructor( 
       private auth : AuthService,
        private changeDetectorRef: ChangeDetectorRef,
        private media: MediaMatcher,
        private router : Router,
      ) {

        this.mobileQuery = this.media.matchMedia('(max-width: 1150px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        // tslint:disable-next-line: deprecation
        this.mobileQuery.addListener(this._mobileQueryListener);

    }

    ngOnInit(): void {
            
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
