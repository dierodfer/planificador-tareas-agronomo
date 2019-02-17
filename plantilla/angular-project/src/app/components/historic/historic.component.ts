import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-historic',
  templateUrl: './historic.component.html',
  styleUrls: ['./historic.component.css']
})
export class HistoricComponent implements OnInit {

  minDate = new Date(2018, 0, 1);
  maxDate = new Date(2020, 0, 1);

  constructor() { }

  ngOnInit() {
  }

}
