import { Component, OnInit, ViewChild } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { UserService } from '../../services/user.service';
import {MatTableDataSource, MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material';
import {Usuario} from '../../models/usuario';
import {Tarea} from '../../models/tarea';
import {COMMA, ENTER, TAB} from '@angular/cdk/keycodes';
import { CookieService } from 'ngx-cookie-service';
import { Grupo } from 'src/app/models/grupo';
import { GroupService } from 'src/app/services/group.service';
import { DialogDeleteComponent } from '../dialog-delete/dialog-delete.component';

@Component({
  selector: 'app-taks-list',
  templateUrl: './taks-list.component.html',
  styleUrls: ['./taks-list.component.css']
})
export class TaksListComponent implements OnInit {

  @ViewChild('rol') rolButton;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA, TAB];
  tareas: Tarea[] = [];
  userSelected: Usuario;
  grupoSelected: Grupo;
  filtro = false;
  rol = 'coordinador';
  usuarios: Usuario[] = [];
  misGrupos: Grupo[];
  deleteDialog: MatDialogRef<DialogDeleteComponent>;

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

  getTareas(userId) {
    this.filtro = false;
    this.userSelected = this.usuarios.find(usuario => usuario.empleado === userId);
    this.taskService.getTaskByUser(userId).subscribe(tareas => this.tareas = tareas as Tarea[]);
  }

  getUsuarios(grupo: Grupo) {
    this.usuarios = [];
    grupo.usuarios.forEach(id => this.usuarioService.getUserById(id).forEach(usuario => this.usuarios.push(usuario as Usuario)));
  }

  cancelarTarea(id) {
    this.taskService.cancelTask(id);
  }

  descancelarTarea(id) {
    this.taskService.uncancelTask(id);
  }

  finalizarTarea(id) {
    this.taskService.finishTask(id);
  }

  activarTarea(id) {
    this.taskService.unfinishedTask(id);
  }

  eliminarTarea(id) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {detalles: 'Se eliminará de forma permanente.'};
    this.deleteDialog = this.dialog.open(DialogDeleteComponent, dialogConfig);
    this.deleteDialog.afterClosed().subscribe(confirmado => {
      if (confirmado) {
        this.taskService.deleteTask(id);
      }
    });
  }

  dateChange(event) {
    this.filtro = true;
    this.taskService.getTaskByUserAndDate(this.userSelected.empleado, event.value).subscribe(tareas => this.tareas = tareas as Tarea[]);
  }

  limpiarFiltro() {
    this.filtro = false;
    this.taskService.getTaskByUser(this.userSelected.empleado).subscribe(tareas => this.tareas = tareas as Tarea[]);
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

