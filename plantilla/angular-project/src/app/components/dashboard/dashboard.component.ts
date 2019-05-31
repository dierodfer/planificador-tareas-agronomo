import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/services/task.service';
import { IncidentService } from 'src/app/services/incident.service';
import { Incidencia } from 'src/app/models/incidencia';
import { Tarea } from 'src/app/models/tarea';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { DialogIncidentDetailsComponent } from '../dialog-incident-details/dialog-incident-details.component';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  numeroIncidenciasPendientes; numeroIncidenciasAtendidas; numeroIncidenciasResueltas;
  numeroTareasActivas; numeroTareasInterrumpidas; numeroTareasFinalizadas;
  incidenciasCriticas: Incidencia[] = [];
  tareasRetrasadas: Tarea[] = [];
  chipTareas = 'day'; chipIncidencias = 'day';
  fechaTareas = moment().startOf('day'); fechaIncidencias = moment().startOf('day');
  tipoTareas = new Map();
  tipoIncidencias = new Map();

  constructor(
    private tareaService: TaskService,
    private incidenciaService: IncidentService,
    private dialog: MatDialog,
    private router: Router,
    private cookie: CookieService
  ) { }

  getNumTareasActivas() {
    this.tareaService.getPendingTaskByDate(this.fechaTareas).subscribe(tareas =>
      this.numeroTareasActivas = tareas.length
    );
  }

  getNumTareasInterrumpidas() {
    this.tareaService.getCancelTaskByDate(this.fechaTareas).subscribe(tareas =>
      this.numeroTareasInterrumpidas = tareas.length
    );
  }

  getNumTareasFinalizadas() {
    this.tareaService.getFinishTaskByDate(this.fechaTareas).subscribe(tareas =>
      this.numeroTareasFinalizadas = tareas.length
    );
  }

  getNumIncidenciasPendientes() {
    this.incidenciaService.getIncidentsByStateAndDate('Pendiente', this.fechaIncidencias).subscribe((incidencias: Incidencia[]) => {
      this.numeroIncidenciasPendientes = incidencias.length;
    });
  }

  getNumIncidenciasAtendidas() {
    this.incidenciaService.getIncidentsByStateAndDate('Atendida', this.fechaIncidencias).subscribe((incidencias: Incidencia[]) => {
      this.numeroIncidenciasAtendidas = incidencias.length;
    });
  }

  getNumIncidenciasResueltas() {
    this.incidenciaService.getIncidentsByStateAndDate('Resuelta', this.fechaIncidencias).subscribe((incidencias: Incidencia[]) => {
      this.numeroIncidenciasResueltas = incidencias.length;
    });
  }

  getNumTotalTareas() {
    return this.numeroTareasActivas + this.numeroTareasInterrumpidas + this.numeroTareasFinalizadas;
  }

  getNumTotalIncidencias() {
    return this.numeroIncidenciasAtendidas + this.numeroIncidenciasPendientes + this.numeroIncidenciasResueltas;
  }

  getTipoTareasPendientes() {
    this.tipoTareas.clear();
    this.tareaService.getPendingTaskByDate(this.fechaTareas).forEach((tareas) => tareas.forEach((tarea: Tarea) => {
      if (this.tipoTareas.has(tarea.tipo)) {
        this.tipoTareas.set(tarea.tipo, this.tipoTareas.get(tarea.tipo) + 1);
      } else {
        this.tipoTareas.set(tarea.tipo, 1);
      }
    }));
  }

   getTipoTareasInterrumpidas() {
    this.tipoTareas.clear();
    this.tareaService.getCancelTaskByDate(this.fechaTareas).forEach((tareas) => tareas.forEach((tarea: Tarea) => {
      if (this.tipoTareas.has(tarea.tipo)) {
        this.tipoTareas.set(tarea.tipo, this.tipoTareas.get(tarea.tipo) + 1);
      } else {
        this.tipoTareas.set(tarea.tipo, 1);
      }
    }));
  }

  getTipoTareasFinalizadas() {
    this.tipoTareas.clear();
    this.tareaService.getFinishTaskByDate(this.fechaTareas).forEach((tareas) => tareas.forEach((tarea: Tarea) => {
      if (this.tipoTareas.has(tarea.tipo)) {
        this.tipoTareas.set(tarea.tipo, this.tipoTareas.get(tarea.tipo) + 1);
      } else {
        this.tipoTareas.set(tarea.tipo, 1);
      }
    }));
  }

  toggleChipTareas(estado) {
    this.fechaTareas = moment().startOf(estado);
    this.chipTareas = estado;
    this.getNumTareasActivas();
    this.getNumTareasInterrumpidas();
    this.getNumTareasFinalizadas();
  }

  toggleChipIncidencias(estado) {
    this.fechaIncidencias = moment().startOf(estado);
    this.chipIncidencias = estado;
    this.getNumIncidenciasPendientes();
    this.getNumIncidenciasAtendidas();
    this.getNumIncidenciasResueltas();
  }

  getIncidenciasCriticas() {
    this.incidenciaService.getIncidentsCritical()
    .subscribe((incidencias: Incidencia[]) => {
      this.incidenciasCriticas = incidencias;
    });
  }

  getTareasRestrasadas() {
    this.tareaService.getTaskDelayed().subscribe((tareas: Tarea[]) =>
      this.tareasRetrasadas = tareas);
  }

  diffDias(fecha) {
    return moment(fecha).diff(moment().startOf('day'), 'day');
  }

  openIncidentDialog(incidencia) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = incidencia;
    this.dialog.open(DialogIncidentDetailsComponent, dialogConfig);
  }

  goTask(id) {
    this.router.navigate(['inicio/tareas/lista/', id]);
  }

  ngOnInit() {
    if (this.cookie.get('rol') === 'TRABAJADOR' || this.cookie.get('rol') === 'COORDINADOR') {
      this.router.navigate(['inicio/tareas/lista']);
    }
    this.getNumTareasActivas();
    this.getNumTareasInterrumpidas();
    this.getNumTareasFinalizadas();
    this.getNumIncidenciasPendientes();
    this.getNumIncidenciasAtendidas();
    this.getNumIncidenciasResueltas();
    this.getIncidenciasCriticas();
    this.getTareasRestrasadas();
  }

}
