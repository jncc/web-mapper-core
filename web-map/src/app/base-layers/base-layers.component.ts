import { Component, OnInit } from '@angular/core';
import { MapService } from '../map.service';
import { Observable } from 'rxjs';

import Tile from 'ol/layer/tile';

@Component({
  selector: 'app-base-layers',
  templateUrl: './base-layers.component.html',
  styleUrls: ['./base-layers.component.scss']
})
export class BaseLayersComponent implements OnInit {

  baseLayers$: Observable<Tile[]>;

  constructor(private mapService: MapService) { }

  ngOnInit() {
    this.baseLayers$ = this.mapService.baseLayers;
  }

}
