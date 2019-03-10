import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Incidencia } from 'src/app/models/incidencia';

@Component({
  selector: 'app-dialog-incident-details',
  templateUrl: './dialog-incident-details.component.html',
  styleUrls: ['./dialog-incident-details.component.css']
})
export class DialogIncidentDetailsComponent implements OnInit {

  incidencia: Incidencia;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.incidencia = data as Incidencia;
  }

  ngOnInit() {
  }

}
