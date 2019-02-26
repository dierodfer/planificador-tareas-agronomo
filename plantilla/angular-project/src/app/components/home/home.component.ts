import { Component, OnInit } from '@angular/core';
import { DialogIncidentComponent } from '../dialog-incident/dialog-incident.component';
import { MatDialog } from '@angular/material';
import { Usuario } from 'src/app/models/usuario';
import { MessagingService } from 'src/app/services/messaging.service';
import { CookieService } from 'ngx-cookie-service';
import { NotificationService } from 'src/app/services/notification.service';
import { Buzon } from 'src/app/models/buzon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  usuario: Usuario;

  nuevasNoti: Boolean;
  idBuzon: string;

  constructor(
    private dialog: MatDialog,
    private messagingService: MessagingService,
    private cookieService: CookieService,
    private notificacionService: NotificationService,
    private router: Router
    ) { }

  openIncidenceDialog() {
    this.dialog.open(DialogIncidentComponent);
  }

  openNotifications() {
    this.notificacionService.toggleBuzon();
    this.router.navigate(['inicio', 'notificaciones']);
  }

  ngOnInit() {
/*     this.messagingService.requestPermission(this.cookieService.get('sesionId')); */
/*     this.messagingService.receiveMessage(); */
    this.notificacionService.getMyBuzon().subscribe(
      (buzon: Buzon) => {
        this.nuevasNoti = buzon.visto;
      }
    );
/*     this.message = this.messagingService.currentMessage; */
  }

}
