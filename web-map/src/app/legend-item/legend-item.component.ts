import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-legend-item',
  templateUrl: './legend-item.component.html',
  styleUrls: ['./legend-item.component.scss']
})
export class LegendItemComponent implements OnInit {

  @Input() legendItem: string;

  constructor() { }

  ngOnInit() {
  }

}
