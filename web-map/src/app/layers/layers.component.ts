import { Component, OnInit } from '@angular/core';
import { MapService } from '../map.service';
import { ILayerConfig } from '../models/layer-config.model';
import { ILayerGroupConfig } from '../models/layer-group-config';

@Component({
  selector: 'app-layers',
  templateUrl: './layers.component.html',
  styleUrls: ['./layers.component.scss']
})
export class LayersComponent implements OnInit {
  layerGroups = [{
    name: 'andyb'
  }];

  show = true;

  constructor(private mapService: MapService) { }

  ngOnInit() {
    this.mapService.mapConfig.subscribe((data) => {
      if (data.mapInstance) {
        this.layerGroups = data.mapInstance.layerGroups;
      }
    });
  }

  onLayerVisiblityChanged(event: {layerId: number, visible: boolean}) {
    this.mapService.changeLayerVisibility(event.layerId, event.visible);
  }

  toggleShow() {
    this.show = !this.show;
  }

}
