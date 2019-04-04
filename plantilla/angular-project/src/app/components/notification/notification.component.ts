import { Component, OnInit, OnDestroy } from '@angular/core';
import { MessagingService } from '../../services/messaging.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Buzon } from 'src/app/models/buzon';
import { Notificacion } from 'src/app/models/notificacion';
import { CookieService } from 'ngx-cookie-service';
import { DialogDeleteComponent } from '../dialog-delete/dialog-delete.component';
import { MatDialogRef, MatDialogConfig, MatDialog } from '@angular/material';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit, OnDestroy {

  buzon: Buzon;
  notificaciones: Notificacion[];
  deleteDialog: MatDialogRef<DialogDeleteComponent>;

  constructor(private messagingService: MessagingService,
    private notificacionService: NotificationService,
    private cookie: CookieService,
    private dialog: MatDialog) { }

  deleteAllNotificacion() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      detalles: 'El buzón se vaciará por completo.',
      titulo: '¿Seguro desea eliminar?'
    };
    this.deleteDialog = this.dialog.open(DialogDeleteComponent, dialogConfig);
    this.deleteDialog.afterClosed().subscribe(confirmado => {
      if (confirmado) {
        this.notificacionService.createBuzon(this.cookie.get('sesionId'));
      }
    });
  }

  deleteNotificacion(noti: Notificacion) {
    this.notificacionService.deleteNotification(noti);
  }

  enviarAdmin() {
    this.messagingService.sendMessage('Notificacion Externa', 'Esto es una Notificacion Externa', '0');
    this.notificacionService.sendNotification('0', new Notificacion('Esto es una Notificacion Interna', 'Notificacion Interna'));
  }

  enviar() {
    this.notificacionService.sendNotification(this.cookie.get('sesionId'),
    new Notificacion('Esto es una descripción', 'Titulo Notificación'));
  }

  ngOnInit() {
    this.notificacionService.getMyBuzon().subscribe(
      (buzon: Buzon) => {
        this.notificaciones = buzon.notificaciones.reverse();
      }
    );
  }

  ngOnDestroy() {
    this.notificacionService.toggleMyNotifications();
  }

}
