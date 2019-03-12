import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { LayerService } from '../layer.service';
import { ILayerGroupConfig } from '../models/layer-group-config';
import { Observable } from 'rxjs';
import { MapService } from '../map.service';

@Component({
  selector: 'app-external-layers',
  templateUrl: './external-layers.component.html',
  styleUrls: ['./external-layers.component.scss']
})
export class ExternalLayersComponent implements OnInit {
  @Output() closeExternalLayers = new EventEmitter<void>();

  layerGroupConfig$: Observable<ILayerGroupConfig>;
  url: string;

  constructor(private mapService: MapService, private layerService: LayerService) { }

  ngOnInit() {
  }

  onCloseExternalLayers() {
    this.closeExternalLayers.emit();
  }

  onGetExternalLayers() {
    this.layerGroupConfig$ = this.layerService.getExternalLayers(this.url);
  }

  onAddToMap(layerGroupConfig: ILayerGroupConfig) {
    this.mapService.addExternalLayerGroupConfig(layerGroupConfig);
    this.closeExternalLayers.emit();
  }

}
