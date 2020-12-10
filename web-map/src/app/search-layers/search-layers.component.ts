import { Component, OnInit, ViewChild } from '@angular/core';
import { NgSelectComponent } from '@ng-select/ng-select';
import { ILayerConfig } from '../models/layer-config.model';
import { MapService } from '../map.service';

@Component({
  selector: 'app-search-layers',
  templateUrl: './search-layers.component.html',
  styleUrls: ['./search-layers.component.scss']
})
export class SearchLayersComponent implements OnInit {

  @ViewChild('searchLayers', { static: true }) searchLayers: NgSelectComponent;

  placeholder = 'Find layer ..';

  selectedResult: ILayerConfig;

  layers: ILayerConfig[];

  constructor(private mapService: MapService) {
  }

  ngOnInit() {
    this.mapService.mapConfig.subscribe(mapConfig => {
      let layers: ILayerConfig[] = [];
      mapConfig.mapInstance.layerGroups.forEach(layerGroup => {
        layers = [...layers, ...layerGroup.layers];
      });
      layers.sort((a, b) => a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1);
      this.layers = layers;
    });
  }

  onChange() {
    if (this.selectedResult) {
      this.mapService.changeLayerVisibility(this.selectedResult.layerId, true);
      this.mapService.zoomToLayerExtent(this.selectedResult.layerId);
      this.searchLayers.blur();
    }
  }

  onFocus() {
    this.selectedResult = null;
  }

}
