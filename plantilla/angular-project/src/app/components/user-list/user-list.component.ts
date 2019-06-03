import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import {MatPaginator, MatTableDataSource, MatSort, MatDialogConfig } from '@angular/material';
import {Usuario} from '../../models/usuario';
import {COMMA, ENTER, TAB} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material';
import {MatDialog} from '@angular/material';
import { DialogUserComponent } from '../dialog-user/dialog-user.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  displayedColumns: string[] = ['nombre', 'empleado', 'genero', 'rol', 'acciones'];
  dataSource: MatTableDataSource<Usuario>;
  dataSource2: MatTableDataSource<Usuario>;
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginator2') paginator2: MatPaginator;
  @ViewChild('sort') sort: MatSort;
  @ViewChild('sort2') sort2: MatSort;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA, TAB];
  filters: string[] = [];
  bloqueados = false;

  constructor(private usuarioService: UserService,
    private dialog: MatDialog,
    private router: Router) { }

  getUsuarios() {
    this.usuarioService.getNoBannedUsers().subscribe(
      usuarios => {
        this.dataSource = new MatTableDataSource(usuarios as Usuario[]);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    });
  }

  getUsuariosBloqueados() {
    this.usuarioService.getBannedUsers().subscribe(
      usuarios => {
        this.dataSource2 = new MatTableDataSource(usuarios as Usuario[]);
        this.dataSource2.paginator = this.paginator2;
        this.dataSource2.sort = this.sort2;
      });
  }

  showUsuariosBloqueados() {
    this.bloqueados = !this.bloqueados;
    this.getUsuariosBloqueados();
  }

  editarUsuario(id) {
    this.router.navigate(['admin/usuarios/formulario/', id]);
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
        usuario.genero.toLowerCase().indexOf(value) > -1 ||
        usuario.telefono.toLowerCase().indexOf(value) > -1);
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
      this.usuarioService.getNoBannedUsers().subscribe(
        usuarios => {
          this.dataSource.data = usuarios as Usuario[];
          this.filters.forEach(filtro =>
            this.dataSource.data = this.dataSource.data.filter(
              usuario =>
              usuario.nombre.toLowerCase().indexOf(filtro) > -1 ||
              usuario.apellidos.toLowerCase().indexOf(filtro) > -1 ||
              usuario.empleado.toString().indexOf(filtro) > -1 ||
              usuario.rol.toLowerCase().indexOf(filtro) > -1 ||
              usuario.genero.toLowerCase().indexOf(filtro) > -1 ||
              usuario.telefono.toLowerCase().indexOf(filtro) > -1)
          );
        });
    }
  }

  bloquearUsuario(usuario) {
    this.usuarioService.blockUser(usuario);
  }

  desbloquearUsuario(usuario) {
    this.usuarioService.unblockUser(usuario.empleado);
  }

  openDialogUser(user) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = user;
    this.dialog.open(DialogUserComponent, dialogConfig)
  }

  ngOnInit() {
    this.getUsuarios();
  }
}
