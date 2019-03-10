import { Component, OnInit } from '@angular/core';
import { DialogIncidentComponent } from '../dialog-incident/dialog-incident.component';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { Usuario } from 'src/app/models/usuario';
import { MessagingService } from 'src/app/services/messaging.service';
import { CookieService } from 'ngx-cookie-service';
import { NotificationService } from 'src/app/services/notification.service';
import { Buzon } from 'src/app/models/buzon';
import { Router } from '@angular/router';
import { ConnectionService } from 'src/app/services/connection.service';
import { DialogUserComponent } from '../dialog-user/dialog-user.component';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  nuevasNoti: Boolean;
  miUsuario: Usuario;

  constructor(
    private dialog: MatDialog,
    private messagingService: MessagingService,
    private cookie: CookieService,
    private notificacionService: NotificationService,
    private router: Router,
    private connect: ConnectionService,
    private usuarioService: UserService
    ) { }

  openIncidenceDialog() {
    this.dialog.open(DialogIncidentComponent);
  }

  isOnline() {
    return this.connect.isOnline();
  }

  openNotifications() {
    this.notificacionService.toggleBuzon();
    this.router.navigate(['inicio', 'notificaciones']);
  }

  openMyUserDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = this.miUsuario;
    console.log(this.miUsuario);
    this.dialog.open(DialogUserComponent, dialogConfig);
  }

  getMyBuzon() {
    this.notificacionService.getMyBuzon().subscribe(
      (buzon: Buzon) => {
        this.nuevasNoti = buzon.visto;
    });
  }

  getMyUser() {
    this.usuarioService.getMyUser().subscribe(
      user => this.miUsuario = user as Usuario
    );
  }

  ngOnInit() {
    this.getMyBuzon();
    this.getMyUser();
    const sesionId = this.cookie.get('sesionId');
    if (sesionId !== null) {
      this.messagingService.requestPermission(sesionId);
      this.messagingService.receiveMessage();
    }

/*   this.message = this.messagingService.currentMessage; */
  }

}
