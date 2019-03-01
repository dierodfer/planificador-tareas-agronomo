import { Component, OnInit } from '@angular/core';
import { Grupo } from 'src/app/models/grupo';
import { GroupService } from 'src/app/services/group.service';
import { DocumentReference } from '@angular/fire/firestore';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.css']
})
export class GroupListComponent implements OnInit {

  grupos: Grupo[];

  constructor(private grupoService: GroupService) {}


  ngOnInit() {
    this.grupoService.getGroups().subscribe(
      grupos => this.grupos = grupos.map(x => Object.assign({}, x)) as Grupo[]
    );
  }

  print(){
    console.log('hola');
  }

  getUserByGroup(ref: DocumentReference) {
    ref.get().then(doc => {
          if (!doc.exists) {
            console.log('No such document!');
          } else {
           return doc.data();
          }
    });
  }

}

