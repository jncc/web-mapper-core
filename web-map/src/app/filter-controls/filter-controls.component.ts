import { Component, OnInit, Input } from '@angular/core';
import { ILayerConfig } from '../models/layer-config.model';

@Component({
  selector: 'app-filter-controls',
  templateUrl: './filter-controls.component.html',
  styleUrls: ['./filter-controls.component.scss']
})
export class FilterControlsComponent implements OnInit {
  @Input() layer: ILayerConfig;

  constructor() { }

  ngOnInit() {
  }

}
