import { Component, OnInit, ViewChild } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { UserService } from '../../services/user.service';
import { MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material';
import {Usuario} from '../../models/usuario';
import {Tarea} from '../../models/tarea';
import {COMMA, ENTER, TAB} from '@angular/cdk/keycodes';
import { CookieService } from 'ngx-cookie-service';
import { Grupo } from 'src/app/models/grupo';
import { GroupService } from 'src/app/services/group.service';
import { DialogDeleteComponent } from '../dialog-delete/dialog-delete.component';
import { DialogUserComponent } from '../dialog-user/dialog-user.component';

import * as moment from 'moment';

@Component({
  selector: 'app-taks-list',
  templateUrl: './taks-list.component.html',
  styleUrls: ['./taks-list.component.css']
})
export class TaksListComponent implements OnInit {

  @ViewChild('rol') rolButton;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA, TAB];
  tareas: Tarea[] = [];
  tareasGrupales: Tarea[] = [];
  grupoSelected: Grupo;
  userSelected: Usuario;
  filtro = false;
  rol = 'coordinador';
  usuarios: Usuario[];
  misGrupos: Grupo[];
  deleteDialog: MatDialogRef<DialogDeleteComponent>;
  tipoTarea: string;
  pickPendientes = false; pickCanceladas = false; pickFinalizadas = false;
  numPendientes: number; numCanceladas: number; numFinalizadas: number;

  constructor(
    private taskService: TaskService,
    private usuarioService: UserService,
    private cookie: CookieService,
    private dialog: MatDialog,
    private grupoService: GroupService) { }

  getMisGrupos() {
    this.filtro = false;
    this.grupoService.getGroupsByCoordinator(this.cookie.get('sesionId')).subscribe(grupos => this.misGrupos = grupos as Grupo[]);
  }

  getTareas(estado, grupo: Grupo, usuario?: Usuario) {
    this.filtro = false;
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

/*   getTareasGrupales(grupoId) {
    this.filtro = false;
    this.taskService.getTaskByGroup(grupoId).subscribe(tareas => this.tareasGrupales = tareas as Tarea[]);
  } */

  getUsuarios(grupo: Grupo) {
    if (!this.grupoSelected || this.grupoSelected.id !== grupo.id) {
      this.usuarios = [];
      this.tareas = [];
      this.userSelected = undefined;
      this.grupoSelected = grupo;
      this.getTareas('Pendientes', this.grupoSelected);
      /* this.getTareasGrupales(grupo.id); */
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
    return moment(fecha).diff(moment(new Date()), 'day');
  }

  toggleView() {
    this.rol = this.rolButton.value;
  }

  isCoordinador() {
    return this.rol === 'coordinador';
  }

  ngOnInit() {
    // SEGURIDAD
/*     this.cookieService.get('rol'); */
 /*    this.getUsuarios(); */
     this.getMisGrupos();
    /* this.getTareas(userId); */
  }

}

