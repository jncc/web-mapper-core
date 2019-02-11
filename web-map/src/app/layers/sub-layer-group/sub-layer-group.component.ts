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

  constructor() { }

  ngOnInit() {
  }

  toggleShow() {
    this.show = !this.show;
  }

  onLayerVisibilityChanged(layer: ILayerConfig, visible: boolean) {
    this.layerVisibilityChanged.emit({ layerId: layer.layerId, visible: visible });
  }
}
