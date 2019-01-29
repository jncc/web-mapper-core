import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-layers',
  templateUrl: './layers.component.html',
  styleUrls: ['./layers.component.scss']
})
export class LayersComponent implements OnInit {
  layers = [
    'seabed layer',
    'littoral habitats layer',
    'biological zones layer'
  ];

  show = true;

  constructor() { }

  ngOnInit() {
  }

  toggleShow() {
    this.show = !this.show;
  }

}
