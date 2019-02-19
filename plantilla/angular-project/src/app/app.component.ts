import { Component, OnInit } from '@angular/core';
import { MessagingService } from './services/messaging.service';
import { MatDialog } from '@angular/material';
import {DialogIncidentComponent} from './components/dialog-incident/dialog-incident.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  message;

  constructor(private messagingService: MessagingService,
    private dialog: MatDialog) { }

  openIncidenceDialog() {
    this.dialog.open(DialogIncidentComponent);
  }

  ngOnInit() {
     const userId = 'user001';
    this.messagingService.requestPermission(userId);
    this.messagingService.receiveMessage();
    this.message = this.messagingService.currentMessage;
  }
}
