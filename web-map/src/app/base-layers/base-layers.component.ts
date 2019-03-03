import { Component, OnInit } from '@angular/core';
import { MapService } from '../map.service';
import { Observable } from 'rxjs';

import Tile from 'ol/layer/tile';
import { IBaseLayerConfig } from '../models/base-layer-config.model';

@Component({
  selector: 'app-base-layers',
  templateUrl: './base-layers.component.html',
  styleUrls: ['./base-layers.component.scss']
})
export class BaseLayersComponent implements OnInit {

  baseLayers$: Observable<IBaseLayerConfig[]>;

  constructor(private mapService: MapService) { }

  ngOnInit() {
    this.baseLayers$ = this.mapService.baseLayers;
  }

  onSetBaseLayer(baseLayerId: number) {
    this.mapService.setBaseLayer(baseLayerId);
  }
}
