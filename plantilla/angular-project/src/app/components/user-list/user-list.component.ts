import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import {MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import {Usuario} from '../../models/usuario';
import {COMMA, ENTER, TAB} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  displayedColumns: string[] = ['nombre', 'apellidos', 'empleado', 'usuario', 'rol', 'acciones'];
  dataSource: MatTableDataSource<Usuario>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA, TAB];
  filters: string[] = [];

  constructor(private userService: UserService) { }

  getUsuarios() {
  this.userService.getUsuarios().subscribe(
    usuarios => {
      this.dataSource = new MatTableDataSource(usuarios as Usuario[]);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  eliminarUsuario(id: number) {
    this.userService.deleteUsuario(id.toString());
  }

  addFilter(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value.trim().toLowerCase();

    // Añade el filtro y comprueba que no existe
    if ((value || '').trim() && this.filters.indexOf(value.toLowerCase()) === -1) {
      this.filters.push(value.trim());
      this.dataSource.data = this.dataSource.data.filter(usuario =>
        usuario.nombre.toLowerCase().indexOf(value) > -1 ||
        usuario.apellidos.toLowerCase().indexOf(value) > -1 ||
        usuario.empleado.toString().indexOf(value) > -1 ||
        usuario.rol.toLowerCase().indexOf(value) > -1 ||
        usuario.usuario.toLowerCase().indexOf(value) > -1);
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
      this.userService.getUsuarios().subscribe(
        usuarios => {
          this.dataSource.data = usuarios as Usuario[];
          this.filters.forEach(filtro =>
            this.dataSource.data = this.dataSource.data.filter(
              usuario =>
              usuario.nombre.toLowerCase().indexOf(filtro) > -1 ||
              usuario.apellidos.toLowerCase().indexOf(filtro) > -1 ||
              usuario.empleado.toString().indexOf(filtro) > -1 ||
              usuario.rol.toLowerCase().indexOf(filtro) > -1 ||
              usuario.usuario.toLowerCase().indexOf(filtro) > -1)
          );
        });
    }
  }

  ngOnInit() {
    this.getUsuarios();
  }
}
