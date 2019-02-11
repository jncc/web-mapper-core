import { Component, OnInit } from '@angular/core';
import { MapService } from '../map.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ILayerConfig } from '../models/layer-config.model';

@Component({
  selector: 'app-legends',
  templateUrl: './legends.component.html',
  styleUrls: ['./legends.component.scss']
})
export class LegendsComponent implements OnInit {

  show = true;

  legends = [
    'seabed',
    'littoral habitats',
    'biological zones'
  ];

  legends$: Observable<ILayerConfig[]>;

  constructor(private mapService: MapService) {
    this.legends$ = this.mapService.layerLookup.pipe(
      map(layerConfigs => layerConfigs.filter(layerConfig => layerConfig.layer.getVisible()))
      );
  }

  ngOnInit() {
  }

  toggleShow() {
    this.show = !this.show;
  }

  refreshLayers() {
    this.mapService.refreshLayers(0, 1);
  }

}
