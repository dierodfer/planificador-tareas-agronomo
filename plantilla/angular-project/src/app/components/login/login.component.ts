import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Usuario } from 'src/app/models/usuario';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  control = new FormControl('', [Validators.required]);
  valid = false;
  loading = false;
  error = false;
  errorBloqueado = false;

  constructor(private usuarioService: UserService,
    public snackBar: MatSnackBar,
    public router: Router,
    private cookieService: CookieService) { }

  goHome() {
    this.router.navigate(['/inicio']);
  }

  login() {
    this.loading = true;
    this.resetErrors();
    if (this.control.status === 'VALID') {
      this.usuarioService.getUserById(this.control.value).subscribe((user: Usuario) => {
        if (user !== undefined && !user.baneado) {
          this.cookieService.set( 'sesionId', (user as Usuario).empleado );
          this.cookieService.set( 'rol', (user as Usuario).rol );
          this.goHome();
        } else {
          this.errorBloqueado = true;
          this.loading = false;
        }
      });
    } else {
      this.loading = false;
      this.error = true;
    }
  }

  resetErrors() {
    this.errorBloqueado = false;
    this.error = false;
  }

  enter(event) {
    if (event.keyCode === 13) {
      this.login();
    }
  }

  admin() {
    this.control.setValue('0');
  }

  coordinador() {
    this.control.setValue('10');
  }

  trabajador() {
    this.control.setValue('15');
  }

  ngOnInit() {
    if (this.cookieService.check('sesionId')) {
      if (this.cookieService.get('sesionId') !== 'null'){
        this.goHome();
      }
    }
  }

}
