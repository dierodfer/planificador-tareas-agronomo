import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Usuario } from 'src/app/models/usuario';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-dialog-user',
  templateUrl: './dialog-user.component.html',
  styleUrls: ['./dialog-user.component.css']
})
export class DialogUserComponent implements OnInit {

  usuario: Usuario;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public cookie: CookieService) {
      this.usuario = data as Usuario;
  }

  urlTelefono(telefono){
    return 'tel:' + telefono;
  }

  isCoordinador() {
    return this.cookie.get('rol') === 'COORDINADOR' || this.cookie.get('rol') === 'ADMIN';
  }

  ngOnInit() {
  }

}
