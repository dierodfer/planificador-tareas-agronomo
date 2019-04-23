import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Incidencia } from 'src/app/models/incidencia';
import { UserService } from 'src/app/services/user.service';
import { Usuario } from 'src/app/models/usuario';

@Component({
  selector: 'app-dialog-incident-details',
  templateUrl: './dialog-incident-details.component.html',
  styleUrls: ['./dialog-incident-details.component.css']
})
export class DialogIncidentDetailsComponent implements OnInit {

  incidencia: Incidencia;
  usuarios: Usuario[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  private usuarioService: UserService) {
    this.incidencia = data as Incidencia;
  }

  findUsuario(id) {
    return this.usuarios.find(user => user.empleado === id);
  }

  getUsers() {
    this.usuarioService.getAllUsers().subscribe(users => this.usuarios = users as Usuario[]);
  }

  ngOnInit() {
    this.getUsers();
  }

}
