import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {

  usuario: Usuario = new Usuario();

  constructor(private userService: UserService) { }

  ngOnInit() {
  }

  addUsuario() {
    this.userService.addUsuario(this.usuario);
  }

  setNombre(nombre: string) {
    this.usuario.nombre = nombre;
  }

  setRol(rol: string) {
    this.usuario.rol = rol;
  }

  setUsuario(usuario: string) {
    this.usuario.usuario = usuario;
  }

  setApellidos(apellidos: string) {
    this.usuario.apellidos = apellidos;
  }

  setEmpleado(empleado: string) {
    this.usuario.empleado = +empleado;
  }

}
