import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Usuario } from 'src/app/models/usuario';

@Component({
  selector: 'app-dialog-user',
  templateUrl: './dialog-user.component.html',
  styleUrls: ['./dialog-user.component.css']
})
export class DialogUserComponent implements OnInit {

  usuario: Usuario;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
      this.usuario = data as Usuario;
  }

  ngOnInit() {
  }

}
