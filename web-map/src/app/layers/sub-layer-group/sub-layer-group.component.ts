import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { ISubLayerGroupConfig } from 'src/app/models/sub-layer-group-config';
import { ILayerConfig } from 'src/app/models/layer-config.model';

@Component({
  selector: 'app-sub-layer-group',
  templateUrl: './sub-layer-group.component.html',
  styleUrls: ['./sub-layer-group.component.scss']
})
export class SubLayerGroupComponent implements OnInit {
  @Input() subLayerGroup: ISubLayerGroupConfig;
  @Output() layerVisibilityChanged = new EventEmitter<{layerId: number, visible: boolean}>();

  show = false;

  get visibleLayers(): number {
    return (this.subLayerGroup.layers.filter((l) => l.visible === true)).length;
  }

  constructor() { }

  ngOnInit() {
  }

  toggleShow() {
    this.show = !this.show;
  }

  onLayerVisibilityChanged(layer: ILayerConfig, visible: boolean) {
    this.layerVisibilityChanged.emit({ layerId: layer.layerId, visible: visible });
  }

  onToggleLayers() {
    let visible = true;
    if (this.subLayerGroup.layers.every(layerConfig => layerConfig.layer.getVisible())) {
      visible = false;
    }
    this.subLayerGroup.layers.forEach(layerConfig =>
      this.layerVisibilityChanged.emit({ layerId: layerConfig.layerId, visible: visible })
    );
  }
}
