import { Component, OnInit } from '@angular/core';
import { MapService } from '../map.service';
import { Observable } from 'rxjs';

import { IBaseLayer } from '../models/base-layer.model';

@Component({
  selector: 'app-base-layers',
  templateUrl: './base-layers.component.html',
  styleUrls: ['./base-layers.component.scss']
})
export class BaseLayersComponent implements OnInit {

  baseLayers$: Observable<IBaseLayer[]>;

  constructor(private mapService: MapService) { }

  ngOnInit() {
    this.baseLayers$ = this.mapService.baseLayers;
  }

  onSetBaseLayer(baseLayerId: number) {
    this.mapService.setBaseLayer(baseLayerId);
  }
}
