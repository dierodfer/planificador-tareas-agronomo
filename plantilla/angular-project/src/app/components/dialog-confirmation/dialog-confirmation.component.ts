import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-dialog-confirmation',
  templateUrl: './dialog-confirmation.component.html',
  styleUrls: ['./dialog-confirmation.component.css']
})
export class DialogConfirmationComponent implements OnInit {
  control = new FormControl('');
  detalles: string;
  titulo: string;
  tipo: string;
  input;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  private dialogRef: MatDialogRef<DialogConfirmationComponent>) {
    this.detalles = data.detalles;
    this.titulo = data.titulo;
    this.tipo = data.tipo;
    data.input ? this.input = data.input : this.input = false;
  }

  confirm(any?) {
    if (any) {
      this.dialogRef.close(any);
    } else {
      this.dialogRef.close(true);
    }
  }

  openInput() {
    this.input = true;
    this.detalles = 'El coordinador de la tarea será notificado';
    this.titulo = '';
  }

  ngOnInit() {
  }
}
