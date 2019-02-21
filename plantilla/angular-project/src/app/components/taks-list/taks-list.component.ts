import { Component, OnInit, ViewChild } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { UserService } from '../../services/user.service';
import {MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import {Usuario} from '../../models/usuario';
import {Tarea} from '../../models/tarea';
import {COMMA, ENTER, TAB} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-taks-list',
  templateUrl: './taks-list.component.html',
  styleUrls: ['./taks-list.component.css']
})
export class TaksListComponent implements OnInit {

  displayedColumns: string[] = ['nombre', 'apellidos'];
  dataSource: MatTableDataSource<Usuario>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA, TAB];
  filters: string[] = [];
  tareas: Tarea[] = [];
  userSelected: Usuario;
  filtro = false;

  constructor(
    private taskService: TaskService,
    private usuarioService: UserService,
    private cookieService: CookieService) { }

  getTareas(userId) {
    this.filtro = false;
    this.userSelected = this.dataSource.data.find(usuario => usuario.empleado === userId);
    this.taskService.getTaskByUser(userId).subscribe(tareas => this.tareas = tareas as Tarea[]);
  }

  getUsuarios() {
    this.usuarioService.getUsuarios().subscribe(
      usuarios => {
        this.dataSource = new MatTableDataSource(usuarios as Usuario[]);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    }

  addFilter(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value.trim().toLowerCase();

    // Añade el filtro y comprueba que no existe
    if ((value || '').trim() && this.filters.indexOf(value) === -1) {
      this.dataSource.data = this.dataSource.data.filter(usuario =>
        usuario.nombre.toLowerCase().indexOf(value) > -1 ||
        usuario.apellidos.toLowerCase().indexOf(value) > -1 ||
        usuario.empleado.toString().indexOf(value) > -1 ||
        usuario.rol.toLowerCase().indexOf(value) > -1 ||
        usuario.genero.toLowerCase().indexOf(value) > -1);
      this.filters.push(value);
    }

    // Resetea el valor del input
    if (input) {
      input.value = '';
    }
  }

  removeFilter(valor: string): void {
    const index = this.filters.indexOf(valor);

    if (index >= 0) {
      this.filters.splice(index, 1);
      this.usuarioService.getUsuarios().subscribe(
        usuarios => {
          this.dataSource.data = usuarios as Usuario[];
          this.filters.forEach(filtro =>
            this.dataSource.data = this.dataSource.data.filter(
              usuario =>
              usuario.nombre.toLowerCase().indexOf(filtro) > -1  ||
              usuario.apellidos.toLowerCase().indexOf(filtro) > -1 ||
              usuario.empleado.toString().indexOf(filtro) > -1 ||
              usuario.rol.toLowerCase().indexOf(filtro) > -1 ||
              usuario.genero.toLowerCase().indexOf(filtro) > -1 )
          );
        });
    }
  }

  cancelarTarea(id) {
    this.taskService.cancelTask(id);
  }

  descancelarTarea(id) {
    this.taskService.uncancelTask(id);
  }

  finalizarTarea(id){
    this.taskService.finishTask(id);
  }

  activarTarea(id) {
    this.taskService.unfinishedTask(id);
  }

  dateChange(event) {
    this.filtro = true;
    this.taskService.getTaskByUserAndDate(this.userSelected.empleado, event.value).subscribe(tareas => this.tareas = tareas as Tarea[]);
  }

  limpiarFiltro() {
    this.filtro = false;
    this.taskService.getTaskByUser(this.userSelected.empleado).subscribe(tareas => this.tareas = tareas as Tarea[]);
  }

  ngOnInit() {
    // SEGURIDAD
    this.cookieService.check('sessionId');
    this.getUsuarios();
    /* this.getTareas(userId); */
  }

}

