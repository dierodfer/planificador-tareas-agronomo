import { Component, OnInit } from '@angular/core';
import { Grupo } from 'src/app/models/grupo';
import { GroupService } from 'src/app/services/group.service';
import { UserService } from 'src/app/services/user.service';
import { Usuario } from 'src/app/models/usuario';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { DialogUserComponent } from '../dialog-user/dialog-user.component';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.css']
})
export class GroupListComponent implements OnInit {

  control = new FormControl('', [Validators.required]);

  grupos: Grupo[];
  usuarios: Usuario[];
  newUser = {};
  editName = {};

  constructor(private grupoService: GroupService,
    private usuarioService: UserService,
    private dialog: MatDialog) {}

  findUser(id) {
    return this.usuarios.find(user => id === user.empleado);
  }

  getTrabajadores(grupo: Grupo) {
    return this.usuarios.filter(user => 'TRABAJADOR' === user.rol
    && !grupo.usuarios.some(usuario => usuario === user.empleado));
  }

  print(trabajador) {
    console.log(trabajador);
  }

  toggleEditName(groupId) {
    this.editName[groupId] = !this.editName[groupId];
  }

  updateNombre(groupId) {
    if (this.control.value.length > 0) {
      this.grupoService.updateNameGroup(groupId, this.control.value);
    }
    this.editName[groupId] = !this.editName[groupId];
    this.control.reset('');
  }

  toggleAddUser(groupId) {
    this.newUser[groupId] = !this.newUser[groupId];
  }

  addUser(grupo, idUser) {
    if (this.control.value.length > 0) {
      this.grupoService.addUserToGroup(grupo.id, idUser);
      this.control.reset('');
    }
  }

  openUserDialog(user) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = user;
    this.dialog.open(DialogUserComponent, dialogConfig);
  }

  deleteUser(group, idUser) {
    this.grupoService.deleteUserToGroup(group.id, idUser);
  }

  getUsuarios() {
    this.usuarioService.getUsuarios().subscribe(user => this.usuarios = user as Usuario[]);
  }

  getGrupos() {
    this.grupoService.getGroups().subscribe(grupos => this.grupos = grupos as Grupo[]);
  }

  addGrupo() {
    this.grupoService.addGroup(new Grupo('Nuevo Grupo', '10'));
  }

  deleteGrupo(grupo: Grupo) {
    this.grupoService.deleteGroup(grupo.id);
  }


  ngOnInit() {
    this.getUsuarios();
    this.getGrupos();
  }

}

