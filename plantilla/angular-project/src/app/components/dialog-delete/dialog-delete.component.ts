import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-dialog-delete',
  templateUrl: './dialog-delete.component.html',
  styleUrls: ['./dialog-delete.component.css']
})
export class DialogDeleteComponent implements OnInit {
  detalles: string;
  titulo: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  private dialogRef: MatDialogRef<DialogDeleteComponent>) {
    this.detalles = data.detalles;
    this.titulo = data.titulo;
  }

  confirm() {
    this.dialogRef.close(true);
  }

  ngOnInit() {
  }

}
