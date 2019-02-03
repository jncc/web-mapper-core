import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ILayerGroupConfig } from 'src/app/models/layer-group-config';
import { ILayerConfig } from 'src/app/models/layer-config.model';

@Component({
  selector: 'app-layer-group',
  templateUrl: './layer-group.component.html',
  styleUrls: ['./layer-group.component.scss']
})
export class LayerGroupComponent implements OnInit {
  @Input() layerGroup: ILayerGroupConfig;
  @Output() layerVisibilityChanged = new EventEmitter<{layerId: number, visible: boolean}>();

  constructor() { }

  ngOnInit() {
  }

  onLayerVisibilityChanged(layer: ILayerConfig, visible: boolean) {
    this.layerVisibilityChanged.emit({ layerId: layer.layerId, visible: visible });
  }

}
