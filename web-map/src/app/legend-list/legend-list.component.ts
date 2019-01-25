import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-legend-list',
  templateUrl: './legend-list.component.html',
  styleUrls: ['./legend-list.component.scss']
})
export class LegendListComponent implements OnInit {

  show = true;

  legends = [
    'seabed',
    'littoral habitats',
    'biological zones'
  ];

  constructor() { }

  ngOnInit() {
  }

  toggleShow() {
    this.show = !this.show;
  }

}
