import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { IBaseLayerConfig } from 'src/app/models/base-layer-config.model';

@Component({
  selector: 'app-base-layer',
  templateUrl: './base-layer.component.html',
  styleUrls: ['./base-layer.component.scss']
})
export class BaseLayerComponent implements OnInit {

  @Input() baseLayer: IBaseLayerConfig;
  @Output() setBaseLayer = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }

  onSetBaseLayer() {
    this.setBaseLayer.emit();
  }

}
