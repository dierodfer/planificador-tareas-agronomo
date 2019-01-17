import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import {MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import {Usuario} from '../../models/usuario';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
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
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  list: string[] = [];

  constructor(private userService: UserService) { }

  getUsuarios() {
  this.userService.getUsuarios('').subscribe(
    usuarios => {
      this.dataSource = new MatTableDataSource(usuarios as Usuario[]);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  eliminarUsuario(id: number) {
    this.userService.deleteUser(id.toString());
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.list.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(valor: string): void {
    const index = this.list.indexOf(valor);

    if (index >= 0) {
      this.list.splice(index, 1);
    }
  }

  ngOnInit() {
    this.getUsuarios();
  }
}
