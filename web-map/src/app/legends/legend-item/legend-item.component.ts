import { Component, OnInit, Input } from '@angular/core';
import { ILayerConfig } from 'src/app/models/layer-config.model';

@Component({
  selector: 'app-legend-item',
  templateUrl: './legend-item.component.html',
  styleUrls: ['./legend-item.component.scss']
})
export class LegendItemComponent implements OnInit {

  @Input() legend: ILayerConfig;

  constructor() { }

  ngOnInit() {
  }

}
