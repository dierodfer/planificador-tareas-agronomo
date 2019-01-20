import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { Tarea } from '../../models/tarea';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-lista-draggable',
  templateUrl: './lista-draggable.component.html',
  styleUrls: ['./lista-draggable.component.css']
})
export class ListaDraggableComponent implements OnInit {

  todo: Tarea[] = [];
  done: Tarea[] = [];
  tarea: Tarea = new Tarea();
  tareasCopia: Tarea[] = [];
  tareasCopia2: String[] = [];

  constructor(private taskService: TaskService) { }

  ngOnInit() {
      this.taskService.getTareas().subscribe(
        tareas => {
          // Realiza una copia de las listas recibidas
          this.todo = tareas.map(x => Object.assign({}, x)) as Tarea[];
          this.done = tareas.map(x => Object.assign({}, x)) as Tarea[];
        });
  }

  drop(event: CdkDragDrop<string[]>) {
    console.log(event.previousIndex + '=>' + event.currentIndex);
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }

    this.actualizarOrden();
/*     this.tareasCopia = [];
    event.container.data.forEach(element => {
      this.tareasCopia.push(JSON.parse(JSON.stringify(element)));
    }); */

/*     this.tareasCopia = event.container.data;
    this.tareasCopia2 = event.previousContainer.data; */
/*  this.tarea.nombre = event.container.data[event.previousIndex]['orden'];
    this.tarea.orden = event.container.data[event.currentIndex]['orden']; */
  }


  actualizarOrden() {
    let i = 0;
    this.todo.map(element => {
      element.orden = i.toString();
      i++;
    });
    i = 0;
    this.done.map(element => {
      element.orden = i.toString();
      i++;
    });
  }
}
