import { Component, OnInit, Input } from '@angular/core';

import Tile from 'ol/layer/tile';

@Component({
  selector: 'app-base-layer',
  templateUrl: './base-layer.component.html',
  styleUrls: ['./base-layer.component.scss']
})
export class BaseLayerComponent implements OnInit {

  @Input() baseLayer: Tile;

  constructor() { }

  ngOnInit() {
  }

}
