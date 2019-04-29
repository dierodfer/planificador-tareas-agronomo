import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Fase } from 'src/app/models/fase';
import { CycleService } from 'src/app/services/cycle.service';
import { TareaCiclo } from 'src/app/models/tareaCiclo';

@Component({
  selector: 'app-cycle-form',
  templateUrl: './cycle-form.component.html',
  styleUrls: ['./cycle-form.component.css']
})
export class CycleFormComponent implements OnInit {

/*   control = new FormControl('', Validators.required); */
  fases: Fase[];
  editable = false;

  constructor(private cycleService: CycleService) { }

  addFase() {
    this.fases.push(new Fase('Fase ' + (this.fases.length + 1).toString()));
  }

  removeFase(fase) {
      this.submit(false);
      this.cycleService.deleteFase(fase);
      this.fases.splice(this.fases.findIndex(res => res === fase) , 1);
      this.fases.forEach((res, index) =>
        this.cycleService.updateNombre(res, 'Fase ' + (index + 1).toString()
      ));
  }

  addTarea(fase, nivel) {
    let nombre;
    nivel === 1 ? nombre = 'Nueva Tarea' : nombre = 'Nueva Sub-Tarea';
    fase.tareas.push(new TareaCiclo(nombre));
  }

  removeTarea(fase, tarea) {
    fase.tareas.splice(fase.tareas.findIndex(res => res === tarea), 1);
  }

  toggleEdit() {
    this.editable = !this.editable;
  }

  getCycle() {
    this.cycleService.getFases().subscribe(fases => {
      this.fases = fases as Fase[];
    });
  }

  submit(toggle = true) {
    this.fases.forEach(fase => {
      this.cycleService.addFase(fase);
    });
    if (toggle) {
      this.toggleEdit();
    }
  }

  close() {
    this.toggleEdit();
    this.getCycle();
  }

  ngOnInit() {
    this.getCycle();
  }

}
