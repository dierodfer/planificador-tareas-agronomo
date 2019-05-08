import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario';
import { UserService } from '../../services/user.service';
import {FormControl, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material';
import { Tarea } from 'src/app/models/tarea';
import { TaskService } from 'src/app/services/task.service';
import * as moment from 'moment';
import { CycleService } from 'src/app/services/cycle.service';
import { Fase } from 'src/app/models/fase';
import { GroupService } from 'src/app/services/group.service';
import { CookieService } from 'ngx-cookie-service';
import { Grupo } from 'src/app/models/grupo';
import { Location } from '@angular/common';

@Component({
  selector: 'app-taks-form',
  templateUrl: './taks-form.component.html',
  styleUrls: ['./taks-form.component.css']
})
export class TaksFormComponent implements OnInit {
  controlTipo = new FormControl('', [Validators.required]);
  controlFecha = new FormControl('', [Validators.required]);
  controlUsuarios = new FormControl('', [Validators.required]);
  controlDescrip = new FormControl('');
  controlRepit = new FormControl('', [Validators.required, Validators.min(1), Validators.max(30)]);
  controlSubtipo1 = new FormControl('', [Validators.required]);
  controlSubtipo2 = new FormControl('', [Validators.required]);
  controlSubtipo3 = new FormControl('', [Validators.required]);
  controlGrupal = new FormControl('');
  controlGrupo = new FormControl('', [Validators.required]);
  controlFechaEstimacion = new FormControl('', [Validators.required]);

  minDatepicker = moment().subtract(6, 'days').toDate();
  minDateFinishpicker = moment().subtract(6, 'days').toDate();
  usuarios: Usuario[] = [];
  fases: Fase[];
  misGrupos: Grupo[] = [];

  constructor(
    private usuarioService: UserService,
    private taskService: TaskService,
    private snackBar: MatSnackBar,
    private fasesService: CycleService,
    private groupService: GroupService,
    private cookie: CookieService,
    private _location: Location) { }

  getUsuarios() {
    this.usuarioService.getAllUsers().subscribe(usuarios => this.usuarios = usuarios as Usuario[]);
  }

  getUsariosPorGrupo(grupo: Grupo) {
    this.usuarios = [];
    grupo.usuarios.forEach(id => this.usuarioService.getUserById(id).forEach(usuario => this.usuarios.push(usuario as Usuario)));
  }

  submit() {
     if (this.checkStatus()) {
      if (this.controlGrupal.value) {
        // Cuando es una tarea grupal
        const tarea = this.getTarea();
        this.taskService.addTask(tarea);
      } else {
        // Cuando es una tarea individual
        this.controlUsuarios.value.forEach(user => {
/*           if (this.controlRepit.value > 1) {
            let a = this.controlRepit.value - 1;
            do {// Agrega tareas hasta que se cumpla el número de dias requerido
              const copy = this.getTarea();
              copy.responsable = user.empleado;
              this.taskService.addTask(copy);
              copy.fechaComienzo = moment(copy.fechaComienzo).add(a, 'day').toDate();
            }while (a-- > 0);
          } else { */
            const tarea = this.getTarea();
            tarea.responsable = user.empleado;
            this.taskService.addTask(tarea);
        /*   } */
        });
      }
      this.resetValidators();
    } else {
      this.snackBar.open('Complete todos los campos obligatorios', 'Cerrar', {
        duration: 2500,
        panelClass: 'bg-danger',
      });
    }
  }

  getTarea() {
    const res = new Tarea();
    res.tipo = this.controlTipo.value.nombre;
    res.subtipo1 = this.controlSubtipo1.value.nombre;
    res.subtipo2 = this.controlSubtipo2.value.nombre;
    res.subtipo3 = this.controlSubtipo3.value.nombre;
    res.grupal = this.controlGrupal.value;
    res.grupo = this.controlGrupo.value.id;
    res.descripcion = this.controlDescrip.value.trim();
    res.finalizada = false;
    res.cancelada = false;
    res.fechaComienzo = this.controlFecha.value;
    if (this.controlGrupal.value) {
      res.responsable = this.controlGrupo.value.coordinador;
    }
    // Se calcula fecha de estimacion
    if (this.controlRepit.value > 1) {
      res.fechaEstimacion =  moment(res.fechaComienzo).add(this.controlRepit.value - 1, 'day').toDate();
    } else {
      res.fechaEstimacion = res.fechaComienzo;
    }
    return res;
  }

  checkStatus(): boolean {
    return this.controlTipo.status === 'VALID'
    && (this.controlTipo.value.tareas.length > 0 ? this.controlSubtipo1.status === 'VALID' : true)
    && ((this.controlSubtipo1.value) && (this.controlTipo.value.tareas.length > 0) ? this.controlSubtipo2.status === 'VALID' : true)
    && ((this.controlSubtipo2.value) && (this.controlSubtipo2.value.tareas.length > 0) ? this.controlSubtipo3.status === 'VALID' : true)
    &&  this.controlGrupo.status === 'VALID'
    && (!this.controlGrupal.value ? this.controlUsuarios.status === 'VALID' : true)
    &&  this.controlFecha.status === 'VALID'
    &&  this.controlRepit.status === 'VALID';
  }

  resetValidators() {
    this.controlTipo.reset('');
    this.controlFecha.reset('');
    this.controlUsuarios.reset('');
    this.controlRepit.setValue(1);
    this.controlSubtipo1.reset('');
    this.controlSubtipo2.reset('');
    this.controlSubtipo3.reset('');
    this.controlDescrip.reset('');
    this.controlGrupo.reset('');
  }

  getUsersID(): string[] {
    const ids = [];
    this.controlUsuarios.value.forEach(usuario => {
      ids.push(usuario.empleado);
    });
    return ids;
  }

  getFases() {
    this.fasesService.getFases().subscribe(fases => this.fases = fases as Fase[]);
  }

  getMyGroups() {
    this.groupService.getGroupsByCoordinator(this.cookie.get('sesionId')).subscribe(
      grupos => this.misGrupos = grupos as Grupo[]
    );
  }

  subRepit() {
    if (this.controlRepit.value > 1) {
      this.controlRepit.setValue(this.controlRepit.value - 1);
    }
  }

  addRepit() {
    this.controlRepit.setValue(this.controlRepit.value + 1);
  }

  goBack() {
    this._location.back();
  }

  dateChange(event) {
    this.minDateFinishpicker = event.value;
  }

  ngOnInit() {
    this.controlGrupal.setValue(false);
    this.controlRepit.setValue(1);
    // Solo para admin
    // this.getUsuarios();
    this.getFases();
    this.getMyGroups();
  }

}
