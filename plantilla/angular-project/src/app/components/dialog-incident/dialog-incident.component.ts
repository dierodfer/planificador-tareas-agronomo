import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import {Incidencia} from '../../models/incidencia';
import { IncidentService } from 'src/app/services/incident.service';
import { Zona } from 'src/app/models/zona';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-dialog-incident',
  templateUrl: './dialog-incident.component.html',
  styleUrls: ['./dialog-incident.component.css']
})
export class DialogIncidentComponent implements OnInit {
  control1 = new FormControl('', [Validators.required]);
  control2 = new FormControl('', [Validators.required]);
  control3 = new FormControl('', [Validators.required]);
  control4 = new FormControl('', [Validators.required]);
  controlInver = new FormControl('', [Validators.required]);
  controlPrioridad = new FormControl('', [Validators.required]);
  controlSector = new FormControl('');
  controlTabla = new FormControl('');
  controlPlanta = new FormControl('', Validators.pattern('^[0-9]*$'));
  controlInsta = new FormControl('');
  ubicacion;
  sectores = []; filas = [];

  activemap = false;

  constructor(public dialogRef: MatDialogRef<DialogIncidentComponent>,
    private incidenciaService: IncidentService,
    private snackBar: MatSnackBar,
    private usuarioService: UserService) {
    this.control3.setValue(moment().format('D/M/YYYY, h:mm:ss a'));
    usuarioService.getMyUser().forEach(user => this.control4.setValue(user));
    this.controlPrioridad.setValue('Media');
    this.controlInsta.setValue(true);
  }

  submit() {
    if (this.checkStatus()) {
      this.incidenciaService.addIncident(this.getIncidencia());
      this.close();
    } else {
      this.snackBar.open('Complete todos los campos obligatorios', 'Cerrar', {
        duration: 2500,
        panelClass: 'bg-danger',
      });
    }
  }

  getIncidencia() {
    const incidencia = new Incidencia();
    incidencia.autor = this.control4.value;
    incidencia.fechaCreacion = moment().toDate();
    incidencia.tipo = this.control1.value;
    incidencia.estado = 'Pendiente';
    incidencia.prioridad = this.controlPrioridad.value;
    incidencia.descripcion = this.control2.value;
    if (this.controlInsta.value) {
      incidencia.zona = new Zona(this.controlInver.value, this.controlSector.value, this.controlTabla.value, this.controlPlanta.value);
    } else {
      incidencia.ubicacion = this.ubicacion;
    }
    return incidencia;
  }

  getSectores(maxSector) {
    for (let i = 1; i <= maxSector; i++) {
      this.sectores.push(i);
    }
  }

  getFilas(maxFilas) {
    for (let i = 1; i <= maxFilas; i++) {
      this.filas.push(i);
    }
  }

  checkStatus(): boolean {
    return this.control1.status === 'VALID'
    && (this.control1.value === 'Otro' ? this.control2.status === 'VALID' : true)
    && (this.controlInsta.value ? this.controlInver.status === 'VALID' : true)
    && (!this.controlInsta.value ? this.ubicacion : true)
    && (this.controlPlanta.value ? this.controlPlanta.status === 'VALID' : true);
  }

  showMapa() {
    this.activemap = true;
  }

  close() {
    this.dialogRef.close();
  }

  deleteUbicacion() {
    this.ubicacion = false;
  }

  actionMap(event) {
    this.activemap = false;
    if (event !== 'close') {
      this.ubicacion = event;
    }
  }

  ngOnInit() {
    this.getSectores(20); // Numero máximo de sectores que pueden existir actualmente 7
    this.getFilas(99); // Numero máximo de sectores que pueden existir actualmente 78
  }

}
