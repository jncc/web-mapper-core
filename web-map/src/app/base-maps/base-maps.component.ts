import { Component, OnInit } from '@angular/core';
import { MapService } from '../map.service';
import { Observable } from 'rxjs';

import Tile from 'ol/layer/tile';

@Component({
  selector: 'app-base-maps',
  templateUrl: './base-maps.component.html',
  styleUrls: ['./base-maps.component.scss']
})
export class BaseMapsComponent implements OnInit {

  baseLayers$: Observable<Tile[]>;

  constructor(private mapService: MapService) { }

  ngOnInit() {
    this.baseLayers$ = this.mapService.baseLayers;
    console.log("basemaps");
  }

}
