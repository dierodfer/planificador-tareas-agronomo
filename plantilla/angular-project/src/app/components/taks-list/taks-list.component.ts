import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { UserService } from '../../services/user.service';
import { MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material';
import {Usuario} from '../../models/usuario';
import {Tarea} from '../../models/tarea';
import { CookieService } from 'ngx-cookie-service';
import { Grupo } from 'src/app/models/grupo';
import { GroupService } from 'src/app/services/group.service';
import { DialogDeleteComponent } from '../dialog-delete/dialog-delete.component';
import { DialogUserComponent } from '../dialog-user/dialog-user.component';

import * as moment from 'moment';
import { first } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-taks-list',
  templateUrl: './taks-list.component.html',
  styleUrls: ['./taks-list.component.css']
})
export class TaksListComponent implements OnInit {

  tareas: Tarea[] = []; tareasGrupales: Tarea[] = [];
  grupoSelected: Grupo; userSelected: Usuario;
  filtro = false;
  rol;
  usuarios: Usuario[]; misGrupos: Grupo[];
  gruposAux: Grupo[]; usersAux: Usuario[];
  deleteDialog: MatDialogRef<DialogDeleteComponent>;
  tipoTarea: string;
  editFechaFinalizacion = {}; editFechaComienzo = {};
  pickPendientes = false; pickCanceladas = false; pickFinalizadas = false;
  numPendientes: number; numCanceladas: number; numFinalizadas: number;
  controlFechaComienzo = new FormControl('');
  controlFechaFinalizacion = new FormControl('');

  constructor(
    private taskService: TaskService,
    private usuarioService: UserService,
    private cookie: CookieService,
    private dialog: MatDialog,
    private grupoService: GroupService) { }

  getAllGrupos() {
    this.filtro = false;
    this.grupoService.getGroups().subscribe(grupos => this.misGrupos = grupos as Grupo[]);
  }

  getAllGruposAux() {
    this.grupoService.getGroups().subscribe(grupos => this.gruposAux = grupos as Grupo[]);
  }

  getAllUserAux() {
    this.usuarioService.getAllUsers().subscribe(user => this.usersAux = user as Usuario[]);
  }

  getMisGruposCoordinador() {
    this.filtro = false;
    this.grupoService.getGroupsByCoordinator(this.cookie.get('sesionId')).subscribe(grupos => this.misGrupos = grupos as Grupo[]);
  }

  findGrupo(grupoId) {
    return this.gruposAux.find(grupo => grupo.id === grupoId);
  }

  findUsuario(userId){
    return this.usersAux.find(user => user.empleado === userId);
  }

   // Busca los grupos en los que pertenece el trabajador y selecciona el primero
   getMisGruposUsuario() {
    this.misGrupos = [];
    const id =  this.cookie.get('sesionId');
    this.grupoService.getGroups().pipe(first()).forEach((grupos: Grupo[]) =>
    grupos.forEach((grupo: Grupo) => {
      grupo.usuarios.forEach((s) => {
          if (s === id) { this.misGrupos.push(grupo); }
        });
      })).then( () => {
      this.usuarioService.getMyUser().pipe(first()).forEach((user: Usuario) => {
        this.getTareas('Pendientes', this.misGrupos[0], user);
      });
    });
  }

  getTareas(estado, grupo: Grupo, usuario?: Usuario) {
    this.filtro = false;
    this.grupoSelected = grupo;
    this.tipoTarea = estado;
    if (usuario) {
      this.userSelected = usuario;
      this.taskService.getPendingTaskByUser(usuario.empleado).subscribe((tareas: Tarea[]) => this.numPendientes = tareas.length);
      this.taskService.getCancelTaskByUser(usuario.empleado).subscribe((tareas: Tarea[]) => this.numCanceladas = tareas.length);
      this.taskService.getFinishTaskByUser(usuario.empleado).subscribe((tareas: Tarea[]) => this.numFinalizadas = tareas.length);
    }
    switch (estado) {
      case 'Pendientes':
        if (usuario) {
          this.taskService.getPendingTaskByUser(usuario.empleado).subscribe(tareas => this.tareas = tareas as Tarea[]);
        }
        this.taskService.getPendingTaskByGroup(grupo.id).subscribe(tareas => this.tareasGrupales = tareas as Tarea[]);
        this.pickPendientes = false;
        break;
      case 'Canceladas':
        if (usuario) {
          this.taskService.getCancelTaskByUser(usuario.empleado).subscribe(tareas => this.tareas = tareas as Tarea[]);
        }
        this.taskService.getCancelTaskByGroup(grupo.id).subscribe(tareas => this.tareasGrupales = tareas as Tarea[]);
        this.pickCanceladas = false;
        break;
      case 'Finalizadas':
        if (usuario) {
          this.taskService.getFinishTaskByUser(usuario.empleado).subscribe(tareas => this.tareas = tareas as Tarea[]);
        }
        this.taskService.getFinishTaskByGroup(grupo.id).subscribe(tareas => this.tareasGrupales = tareas as Tarea[]);
        this.pickFinalizadas = false;
        break;
    }
  }

  getUsuarios(grupo: Grupo) {
    if (!this.grupoSelected || this.grupoSelected.id !== grupo.id) {
      this.usuarios = [];
      this.getTareas('Pendientes', grupo);
      grupo.usuarios.forEach(id => this.usuarioService.getUserById(id).forEach(usuario => this.usuarios.push(usuario as Usuario)));
    }
  }

  cancelarTarea(id) {
    this.taskService.cancelTask(id);
    this.pickCanceladas = true;
  }

  descancelarTarea(id) {
    this.taskService.uncancelTask(id);
    this.pickPendientes = true;
  }

  finalizarTarea(id) {
    this.taskService.finishTask(id);
    this.pickFinalizadas = true;
  }

  activarTarea(id) {
    this.taskService.unfinishedTask(id);
    this.pickPendientes = true;
  }

  eliminarTarea(id) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      detalles: 'Se eliminará de forma permanente.',
      titulo: '¿Seguro desea eliminar?'
    };
    this.deleteDialog = this.dialog.open(DialogDeleteComponent, dialogConfig);
    this.deleteDialog.afterClosed().subscribe(confirmado => {
      if (confirmado) {
        this.taskService.deleteTask(id);
      }
    });
  }

  dateChange(event) {
    this.filtro = true;
    // filtrar por usuario o grupo
    this.taskService.getTaskByUserAndDate(this.userSelected.empleado, event.value).subscribe(tareas => this.tareas = tareas as Tarea[]);
  }

  limpiarFiltro() {
    this.filtro = false;
    this.getTareas(this.tipoTarea, this.grupoSelected, this.userSelected);
  }

  openUserDialogByGroup(id) {
    this.grupoService.getGroupById(id).forEach((grupo: Grupo) => {
      this.openUserDialog(grupo.coordinador);
    });
  }

  openUserDialog(id) {
    this.usuarioService.getUserById(id).forEach((user: Usuario) => {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = user;
      this.dialog.open(DialogUserComponent, dialogConfig);
    });
  }

  diffDias(fecha) {
    return moment(fecha).diff(moment().startOf('day'), 'day');
  }

  toggleEditFechaComienzo(tarea: Tarea) {
    this.controlFechaComienzo.setValue(moment(tarea.fechaComienzo).toDate());
    this.editFechaComienzo[tarea.id] = !this.editFechaComienzo[tarea.id];
  }

  toggleEditFechaFinalizacion(tarea: Tarea) {
    this.controlFechaFinalizacion.setValue(moment(tarea.fechaEstimacion).toDate());
    this.editFechaFinalizacion[tarea.id] = !this.editFechaFinalizacion[tarea.id];
  }

  submitFechaComienzo(tarea: Tarea) {
    this.taskService.updateDateStart(tarea.id, this.controlFechaComienzo.value);
    this.editFechaComienzo[tarea.id] = !this.editFechaComienzo[tarea.id];
  }

  submitFechaFinalizacion(tarea: Tarea) {
    this.taskService.updateDateEstimated(tarea.id, this.controlFechaFinalizacion.value);
    this.editFechaFinalizacion[tarea.id] = !this.editFechaFinalizacion[tarea.id];
  }

  isCoordinador() {
    return this.rol === 'COORDINADOR' || this.rol === 'ADMIN';
  }

  ngOnInit() {
    this.rol = this.cookie.get('rol');
    switch (this.rol) {
      case 'TRABAJADOR':
        this.getMisGruposUsuario();
      break;
      case 'COORDINADOR':
        this.getMisGruposCoordinador();
      break;
      case 'ADMIN':
        this.getAllGrupos();
      break;
    }
    // PARCHE
    this.getAllGruposAux();
    this.getAllUserAux();
  }

}

