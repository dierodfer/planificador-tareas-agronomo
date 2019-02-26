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

  constructor(private usuarioService: UserService,
    public snackBar: MatSnackBar,
    public router: Router,
    private cookieService: CookieService) { }

  goHome() {
    this.router.navigate(['/inicio']);
  }

  login() {
    this.loading = true;
    if (this.control.status === 'VALID') {
      this.usuarioService.getUserById(this.control.value).subscribe((user) => {
        if (user !== undefined) {
          this.cookieService.set( 'sesionId', (user as Usuario).empleado );
          this.goHome();
        } else {
          this.error = true;
          this.loading = false;
        }
      }
    );
    } else {
      this.loading = false;
      this.error = true;
    }
  }

  ngOnInit() {
    if (this.cookieService.check('sesionId')) {
      if (this.cookieService.get('sesionId') !== 'null'){
        this.goHome();
      }
    }
  }

}
