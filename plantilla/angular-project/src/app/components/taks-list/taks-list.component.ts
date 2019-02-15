import { Component, OnInit, ViewChild } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { UserService } from '../../services/user.service';
import {MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import {Usuario} from '../../models/usuario';
import {Tarea} from '../../models/tarea';
import {COMMA, ENTER, TAB} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material';

@Component({
  selector: 'app-taks-list',
  templateUrl: './taks-list.component.html',
  styleUrls: ['./taks-list.component.css']
})
export class TaksListComponent implements OnInit {

  displayedColumns: string[] = ['nombre', 'apellidos', 'acciones'];
  dataSource: MatTableDataSource<Usuario>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA, TAB];
  filters: string[] = [];
  tareas: Tarea[] = [];
  userSelected: Usuario;

  constructor(private tareaService: TaskService,
    private usuarioService: UserService) { }

  getTareas(userId) {
    this.userSelected = this.dataSource.data.find(usuario => usuario.empleado === userId);
    this.tareaService.getTaskByUser(userId).subscribe(tareas => this.tareas = tareas as Tarea[]);
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

  ngOnInit() {
    // SEGURIDAD
    this.getUsuarios();
    /* this.getTareas(userId); */
  }
}

