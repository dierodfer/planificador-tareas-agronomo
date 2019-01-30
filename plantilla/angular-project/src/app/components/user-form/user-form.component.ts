import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario';
import { UserService } from '../../services/user.service';
import {FormControl, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {

  control1 = new FormControl('', [Validators.required, Validators.maxLength(80)]);
  control2 = new FormControl('', [Validators.required, Validators.maxLength(80)]);
  control3 = new FormControl('', [Validators.required, Validators.maxLength(80)]);
  control4 = new FormControl('', [Validators.required, Validators.maxLength(80)]);
  control5 = new FormControl('', [Validators.required, Validators.maxLength(80)]);

  usuario: Usuario = new Usuario();

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  addUsuario() {
    if (this.checkStatus()) {
      this.userService.addUsuario(this.usuario);
      this.usuario = new Usuario();
      this.resetValidators();
    } else {
      this.snackBar.open('Ha ocurrido un error', 'Cerrar', {
        duration: 2500,
        panelClass: 'bg-danger',
      });
    }
  }

  checkStatus(): boolean {
    return this.control1.status === 'VALID' && this.control2.status === 'VALID'
    && this.control3.status === 'VALID' && this.control4.status === 'VALID' && this.control5.status === 'VALID';
  }

  resetValidators() {
    this.control1.reset('');
    this.control2.reset('');
    this.control3.reset('');
    this.control4.reset('');
    this.control5.reset('');
  }

}
