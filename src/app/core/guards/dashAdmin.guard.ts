import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class DashAdminGuard implements CanActivate {
  constructor(private route:Router, private auth:AuthService){}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if(localStorage.getItem('sesion') != undefined && this.auth.getTipo() == 1  ){

      return true
    }else{
     
        this.route.navigateByUrl('/admin/dashboard/dashboard-home')
        
      
      return false;
    }
  }
  
}
