import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { ILayerGroupConfig } from 'src/app/models/layer-group-config';
import { ILayerConfig } from 'src/app/models/layer-config.model';

@Component({
  selector: 'app-layer-group',
  templateUrl: './layer-group.component.html',
  styleUrls: ['./layer-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
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
