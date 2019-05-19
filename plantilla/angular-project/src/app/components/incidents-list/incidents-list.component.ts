import { Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator, MatTableDataSource, MatSort, MatDialogConfig } from '@angular/material';
import {MatDialog} from '@angular/material';
import { IncidentService } from 'src/app/services/incident.service';
import { Incidencia } from 'src/app/models/incidencia';
import { DialogUserComponent } from '../dialog-user/dialog-user.component';
import { DialogIncidentDetailsComponent } from '../dialog-incident-details/dialog-incident-details.component';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from 'src/app/services/user.service';
import { Usuario } from 'src/app/models/usuario';

@Component({
  selector: 'app-incidents-list',
  templateUrl: './incidents-list.component.html',
  styleUrls: ['./incidents-list.component.css']
})
export class IncidentsListComponent implements OnInit {

  displayedColumns1: string[] = ['acciones', 'fecha', 'tipo', 'zona', 'autor'];
  displayedColumns2: string[] = ['acciones', 'fecha', 'tipo', 'zona', 'responsable'];
  dataSourcePendientes: MatTableDataSource<Incidencia>;
  dataSourceAtendidas: MatTableDataSource<Incidencia>;
  dataSourceResueltas: MatTableDataSource<Incidencia>;
  @ViewChild('paginator') paginatorPendientes: MatPaginator;
  @ViewChild('paginator2') paginatorAtendidas: MatPaginator;
  @ViewChild('paginator3') paginatorResueltas: MatPaginator;
  @ViewChild('tableSort') sortPendientes: MatSort;
  @ViewChild('tableSort2') sortAtendidas: MatSort;
  @ViewChild('tableSort3') sortResueltas: MatSort;
  activoMapa = false;
  ubicacion;

  usuarios: Usuario[];

  constructor(private incidenciaService: IncidentService,
    private dialog: MatDialog,
    private cookie: CookieService,
    private usuarioService: UserService) { }

  getIncidencias() {
    this.incidenciaService.getIncidentsByState('fechaCreacion', 'Pendiente').subscribe(incidencias => {
      this.dataSourcePendientes = new MatTableDataSource(incidencias as Incidencia[]);
      this.dataSourcePendientes.paginator = this.paginatorPendientes;
      this.dataSourcePendientes.sort = this.sortPendientes;
    });
     this.incidenciaService.getIncidentsByState('fechaAtendida', 'Atendida').subscribe(incidencias => {
      this.dataSourceAtendidas = new MatTableDataSource(incidencias as Incidencia[]);
      this.dataSourceAtendidas.paginator = this.paginatorAtendidas;
      this.dataSourceAtendidas.sort = this.sortAtendidas;
    });
    this.incidenciaService.getIncidentsByState('fechaResuelta', 'Resuelta').subscribe(incidencias => {
      this.dataSourceResueltas = new MatTableDataSource(incidencias as Incidencia[]);
      this.dataSourceResueltas.paginator = this.paginatorResueltas;
      this.dataSourceResueltas.sort = this.sortResueltas;
    });
  }

  incidenciaAtendida(incidencia: Incidencia) {
    this.incidenciaService.updateAtendida(incidencia.id);
  }

  cancelarIncidenciaAtendida(incidencia: Incidencia) {
    this.incidenciaService.cancelAtendida(incidencia.id);
  }

  incidenciaResuelta(incidencia: Incidencia) {
    this.incidenciaService.updateResuelta(incidencia.id);
  }

  isAdmin(){
    return this.cookie.get('rol') === 'ADMIN';
  }

  myId() {
    return this.cookie.get('sesionId');
  }

  openUserDialog(user) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = user;
    this.dialog.open(DialogUserComponent, dialogConfig);
  }

  openIncidentDialog(incidencia) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = incidencia;
    this.dialog.open(DialogIncidentDetailsComponent, dialogConfig);
  }

  showMap(bool: boolean, ubicacion?) {
    if (bool) {
      this.ubicacion = ubicacion;
    }
    this.activoMapa = bool;
  }

  findUsuario(id) {
    return this.usuarios.find(user => user.empleado === id);
  }

  getUsuarios() {
    this.usuarioService.getAllUsers().subscribe(users => this.usuarios = users as Usuario[]);
  }

  ngOnInit() {
    this.getUsuarios();
    this.getIncidencias();
  }

}

