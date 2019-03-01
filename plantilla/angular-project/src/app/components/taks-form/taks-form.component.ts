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
  controlSubtipo = new FormControl('', [Validators.required]);

  minDatepicker = moment().subtract(6, 'days').toDate();
  usuarios: Usuario[] = [];
  fases: Fase[];

  constructor(
    private userService: UserService,
    private taskService: TaskService,
    private snackBar: MatSnackBar,
    private fasesService: CycleService) { }

  getUsuarios() {
    this.userService.getUsuarios().subscribe(usuarios => this.usuarios = usuarios as Usuario[]);
  }

  submit() {
     if (this.checkStatus()) {
      const tarea = this.getTarea();
      const userIds = this.getUsersID();
      userIds.forEach(user => {
        tarea.usuario = user;
        if (this.controlRepit.value > 1) {
          let a = this.controlRepit.value;
          do {// Agrega tareas hasta que se cumpla el número de dias requerido
            this.taskService.addTask(tarea);
            tarea.fecha = moment(tarea.fecha).add(1, 'day').toDate();
          }while (a-- > 1);
        } else {
          this.taskService.addTask(tarea);
        }
      });
/*       this.tarea = new Tarea(); */
      this.resetValidators();
    } else {
      this.snackBar.open('Complete todos los campos obligatorios', 'Cerrar', {
        duration: 2500,
        panelClass: 'bg-danger',
      });
    }
  }

  getTarea() {
    const tarea = new Tarea();
    tarea.descripcion = this.controlDescrip.value;
    tarea.tipo = this.controlTipo.value;
    tarea.subtipo = this.controlSubtipo.value;
    tarea.fecha = this.controlFecha.value;
    return tarea;
  }

  checkStatus(): boolean {
    console.log(this.controlTipo.value.tareas.length);
    return this.controlTipo.status === 'VALID'
    && this.controlFecha.status === 'VALID'
    && (this.controlTipo.value.tareas.length > 0 ? this.controlSubtipo.status === 'VALID' : true)
    && this.controlUsuarios.status === 'VALID'
    && this.controlRepit.status === 'VALID';
  }

  resetValidators() {
    this.controlTipo.reset('');
    this.controlFecha.reset('');
    this.controlUsuarios.reset('');
    this.controlRepit.setValue(1);
    this.controlSubtipo.reset('');
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

  seleccionaTarea(tarea) {
    console.log(tarea);
  }

  ngOnInit() {
    this.controlRepit.setValue(1);
    this.getUsuarios();
    this.getFases();
  }

}
