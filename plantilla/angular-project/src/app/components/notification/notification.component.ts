import { Component, OnInit } from '@angular/core';
import { MessagingService } from '../../services/messaging.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  titulo = '';
  cuerpo = '';
  empleado = '';

  constructor(private mesageService: MessagingService) { }

  send() {
    this.mesageService.sendMessage(this.titulo, this.cuerpo, this.empleado);
  }

  ngOnInit() {
  }

}
