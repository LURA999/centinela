import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class DashUsuarioGuard implements CanActivate {
  constructor(private route:Router, private auth:AuthService){}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
      if(localStorage.getItem('sesion') != undefined && this.auth.getTipo() == 0){
        return true
      }else{
        if(localStorage.getItem('sesion') == undefined){
          this.route.navigateByUrl('/usuario')
        }else{
          this.route.navigateByUrl('/admin/dashboard')
        }
        return false;
      }
  }
  
}
