import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SupportGuard implements CanActivate {
  constructor(private route:Router, private auth:AuthService){}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    
console.log();

    if(localStorage.getItem('sesion') != undefined && this.auth.getTipo() == 1 && this.auth.getCveRol() == 4 ){
      return true
    }else{
        this.route.navigateByUrl('/usuario/dashboard')
      return false;
    }
  }
  
}
