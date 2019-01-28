import { Component, OnInit } from '@angular/core';
import { MapService } from '../map.service';
import { ILayerConfig } from '../models/layer-config.model';

@Component({
  selector: 'app-layers',
  templateUrl: './layers.component.html',
  styleUrls: ['./layers.component.scss']
})
export class LayersComponent implements OnInit {
  layers = [];

  show = true;

  constructor(private mapService: MapService) { }

  ngOnInit() {
    this.mapService.mapConfig.subscribe((data) => {
      if (data.mapInstances.length) {
        this.layers = data.mapInstances[0].layers;
      }
    });
  }

  onVisibilityChanged(layer: ILayerConfig, visible: boolean) {
    this.mapService.changeLayerVisibility(layer.id, visible);
  }

  toggleShow() {
    this.show = !this.show;
  }

}
