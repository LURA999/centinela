import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/compiler/src/core';
import {  Renderer2,ViewEncapsulation } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login-usuario',
  templateUrl: './login-usuario.component.html',
  styleUrls: ['./login-usuario.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LoginUsuarioComponent implements OnInit {

  email = new FormControl('', [Validators.required, Validators.email])
  hide = true;

  constructor(private usuarioServicio : UsuarioService,
    private rendered2 : Renderer2, private router:Router, private auth :AuthService) { }

  ngOnInit(): void {

  }

  //Validacion de correo en input
  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'Debe de ingresar correo ';
    }

    return this.email.hasError('email') ? 'Correo no valido' : '';
  }

  form(){
   var correo =<HTMLInputElement> document.getElementById('valorCorreo');
    var contra =<HTMLInputElement> document.getElementById('valorContra');
    let userCode = btoa(correo.value)
    let passwordCode= btoa(contra.value)

    this.usuarioServicio.login(userCode,passwordCode,0).subscribe((response:any) =>{
      console.log(response)
      if(response.status === "ok"){
        this.auth.crearSesion( response.container);
        this.router.navigateByUrl('/usuario/dashboard')
      }else{
        alert(response.info)
      }
    });
  }

  imprimir(){
    console.log("RESPONSE");
    
  }
}
