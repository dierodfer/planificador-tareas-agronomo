import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import {Incidencia} from '../../models/incidencia';
import { IncidentService } from 'src/app/services/incident.service';
import { Zona } from 'src/app/models/zona';
import { CookieService } from 'ngx-cookie-service';

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
  controlSector = new FormControl('');
  controlTabla = new FormControl('');
  controlPlanta = new FormControl('');

  constructor(public dialogRef: MatDialogRef<DialogIncidentComponent>,
    private incidenciaService: IncidentService,
    private snackBar: MatSnackBar,
    private cookie: CookieService) {
    this.control3.setValue(moment().format('D/M/YYYY, h:mm:ss a'));
    this.control4.setValue('ANA RODRIGUEZ');
  }

  submit() {
    if (this.checkStatus()) {
      const incidencia = new Incidencia();
      incidencia.autor = this.cookie.get('sesionId');
      incidencia.fecha = moment().toDate();
      incidencia.tipo = this.control1.value;
      incidencia.descripcion = this.control2.value;
      incidencia.zona = new Zona(this.controlInver.value, this.controlSector.value, this.controlTabla.value, this.controlPlanta.value);
      this.incidenciaService.addIncident(incidencia);
      this.close();
    } else {
      this.snackBar.open('Complete todos los campos obligatorios', 'Cerrar', {
        duration: 2500,
        panelClass: 'bg-danger',
      });
    }
  }

  checkStatus(): boolean {
    return this.control1.status === 'VALID'
    && this.controlInver.status === 'VALID'
    && (this.control1.value === 'Otro' ? this.control2.status === 'VALID' : true);
  }

  close() {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

}
