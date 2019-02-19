import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario';
import { UserService } from '../../services/user.service';
import {FormControl, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material';
import { Tarea } from 'src/app/models/tarea';
import { TaskService } from 'src/app/services/task.service';
import * as moment from 'moment';

@Component({
  selector: 'app-taks-form',
  templateUrl: './taks-form.component.html',
  styleUrls: ['./taks-form.component.css']
})
export class TaksFormComponent implements OnInit {
  control3 = new FormControl('', [Validators.required]);
  control5 = new FormControl('', [Validators.required]);
  control6 = new FormControl('');

  minDatepicker = moment().subtract(6, 'days').toDate();
  tarea: Tarea = new Tarea();
  usuarios: Usuario[] = [];
  repit = 0;

  constructor(
    private userService: UserService,
    private taskService: TaskService,
    private snackBar: MatSnackBar) { }

  getUsuarios() {
    this.userService.getUsuarios().subscribe(usuarios => this.usuarios = usuarios as Usuario[]);
  }

  submit() {
    if (this.checkStatus()) {
      const userIds = this.getUsersID();
      userIds.forEach(user => {
        this.tarea.usuario = user;
        this.taskService.addTask(this.tarea);
      });
      this.tarea = new Tarea();
      this.resetValidators();
    } else {
      this.snackBar.open('Complete todos los campos obligatorios', 'Cerrar', {
        duration: 2500,
        panelClass: 'bg-danger',
      });
    }
  }

  checkStatus(): boolean {
    return this.control3.status === 'VALID'
    && this.control5.status === 'VALID'
    && this.control6.status === 'VALID';
  }

  resetValidators() {
    this.control3.reset('');
    this.control5.reset('');
    this.control6.reset('');
  }

  getUsersID(): string[] {
    const ids = [];
    this.control6.value.forEach(usuario => {
      ids.push(usuario.empleado);
    });
    return ids;
  }

  ngOnInit() {
    this.getUsuarios();
  }

}
