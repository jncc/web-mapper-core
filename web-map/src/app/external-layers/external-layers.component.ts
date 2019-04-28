import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { LayerService } from '../layer.service';
import { ILayerGroupConfig } from '../models/layer-group-config';
import { Observable } from 'rxjs';
import { MapService } from '../map.service';
import { ILayerConfig } from '../models/layer-config.model';
import { IExternalWmsConfig } from '../models/external-wms-config.model';

@Component({
  selector: 'app-external-layers',
  templateUrl: './external-layers.component.html',
  styleUrls: ['./external-layers.component.scss']
})
export class ExternalLayersComponent implements OnInit {
  @Input() externalWmsUrls: IExternalWmsConfig[];
  @Output() closeExternalLayers = new EventEmitter<void>();

  layerGroupConfig$: Observable<ILayerGroupConfig>;
  url: string;
  selectedLayers: ILayerConfig[] = [];

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
    layerGroupConfig.layers = this.selectedLayers;
    this.mapService.addExternalLayerGroupConfig(layerGroupConfig);
    this.closeExternalLayers.emit();
  }

  onCheckChanged(layerConfig: ILayerConfig, event: Event) {
    const checkbox = <HTMLInputElement>event.target;
    if (checkbox.checked) {
      if (this.selectedLayers.indexOf(layerConfig) === -1) {
        this.selectedLayers.push(layerConfig);
      }
    } else {
      this.selectedLayers = this.selectedLayers.filter(existingLayerConfig => existingLayerConfig !== layerConfig);
    }
  }

  onSelectChanged(url: string) {
      this.url = url;
  }

}
