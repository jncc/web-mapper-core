import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import Tile from 'ol/layer/tile';

@Component({
  selector: 'app-base-layer',
  templateUrl: './base-layer.component.html',
  styleUrls: ['./base-layer.component.scss']
})
export class BaseLayerComponent implements OnInit {

  @Input() baseLayer: Tile;
  @Output() setBaseLayer = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }

  onSetBaseLayer() {
    this.setBaseLayer.emit();
  }

}
