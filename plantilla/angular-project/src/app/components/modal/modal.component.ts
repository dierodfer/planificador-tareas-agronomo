import { Component, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { ModalData } from '../../models/modalData';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {

  constructor(
     public dialogRef: MatDialogRef<ModalComponent>,
     @Inject(MAT_DIALOG_DATA) public data: string[]) {}

   close(): void {
    this.dialogRef.close();
  }


}
