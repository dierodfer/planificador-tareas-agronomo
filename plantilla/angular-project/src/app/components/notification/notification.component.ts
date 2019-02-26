import { Component, OnInit } from '@angular/core';
import { MessagingService } from '../../services/messaging.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Buzon } from 'src/app/models/buzon';
import { Notificacion } from 'src/app/models/notificacion';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  buzon: Buzon;
  notificaciones: Notification[];

  constructor(private mesageService: MessagingService,
    private notificacionService: NotificationService,
    private cookie: CookieService) { }

  deleteAllNotificacion(){
    this.notificacionService.createBuzon(this.cookie.get('sesionId'));
  }

  enviar() {
    this.notificacionService.sendNotification('112', new Notificacion('descripcion123', 'titulo123'));
  }

  ngOnInit() {
    this.notificacionService.getMyBuzon().subscribe(
      (buzon: Buzon) => {
        this.notificaciones = buzon.notificaciones.reverse();
      }
    );
  }

}
