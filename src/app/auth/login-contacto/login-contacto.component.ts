import { Component, OnInit } from '@angular/core';
import {ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { AuthService } from 'src/app/core/services/auth.service';


/**LOGIN PARA ADMINIS */
@Component({
  selector: 'app-login-contacto',
  templateUrl: './login-contacto.component.html',
  styleUrls: ['./login-contacto.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LoginContactoComponent implements OnInit {

  email = new FormControl('', [Validators.required, Validators.email]);
  hide = true;
  formSesion : FormGroup =  this.fb.group({
    correo: ['', Validators.required],
    contrasena:  ['', Validators.required],
  });

  constructor(private router : Router, private usuarioServicio : UsuarioService, private auth : AuthService,
    private fb : FormBuilder) { 
  }

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
    if(this.formSesion.valid){
    this.usuarioServicio.login(btoa(this.formSesion.controls['correo'].value),btoa(this.formSesion.controls['contrasena'].value),1).subscribe((response:any) =>{
      if(response.status === "ok"){
        this.auth.crearSesion(response.container);
        location.reload();
      }else{
        alert(response.info)
      }
    });
  }else{
    alert("Por favor acomplete los campos")
  }
}
  
}
