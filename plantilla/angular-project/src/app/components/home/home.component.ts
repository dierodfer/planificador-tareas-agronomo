import { Component, OnInit } from '@angular/core';
import { DialogIncidentComponent } from '../dialog-incident/dialog-incident.component';
import { MatDialog } from '@angular/material';
import { Usuario } from 'src/app/models/usuario';
import { MessagingService } from 'src/app/services/messaging.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  usuario: Usuario;

  constructor(
    private dialog: MatDialog,
    private messagingService: MessagingService,
    private cookieService: CookieService
    ) { }

  openIncidenceDialog() {
    this.dialog.open(DialogIncidentComponent);
  }

  ngOnInit() {
    this.messagingService.requestPermission(this.cookieService.get('sesionId'));
    this.messagingService.receiveMessage();
/*     this.message = this.messagingService.currentMessage; */
  }

}
