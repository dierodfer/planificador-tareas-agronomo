import { Component, OnInit } from '@angular/core';
import { MessagingService } from './services/messaging.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  message;

  constructor(private messagingService: MessagingService) { }

  ngOnInit() {
     const userId = 'user001';
    this.messagingService.requestPermission(userId);
    this.messagingService.receiveMessage();
    this.message = this.messagingService.currentMessage;
  }
}
