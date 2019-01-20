import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-legend-item',
  templateUrl: './legend-item.component.html',
  styleUrls: ['./legend-item.component.css']
})
export class LegendItemComponent implements OnInit {

  @Input() legendItem: string;

  constructor() { }

  ngOnInit() {
  }

}
