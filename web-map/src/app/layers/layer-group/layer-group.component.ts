import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ILayerGroupConfig } from 'src/app/models/layer-group-config';

@Component({
  selector: 'app-layer-group',
  templateUrl: './layer-group.component.html',
  styleUrls: ['./layer-group.component.scss']
})
export class LayerGroupComponent implements OnInit {
  @Input() layerGroup: ILayerGroupConfig;
  @Output() layerVisibilityChanged = new EventEmitter<{layerId: number, visible: boolean}>();

  get visibleLayers(): number {
    return (this.layerGroup.layers.filter((l) => l.visible === true)).length;
  }

  show = false;

  constructor() { }

  ngOnInit() {
  }

  toggleShow() {
    this.show = !this.show;
  }

  onLayerVisibilityChanged(event: {layerId: number, visible: boolean}) {
    this.layerVisibilityChanged.emit({ layerId: event.layerId, visible: event.visible });
  }

}
