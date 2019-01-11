import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from '../../services/user.service'


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  items: Observable<any[]>;

  constructor(private userService:UserService) { }

  getUsuarios(){
    this.items = this.userService.getUsuarios();
  }

  ngOnInit() {
    this.getUsuarios();
  }

}
