import { Component, OnInit } from '@angular/core';
import { MapService } from '../map.service';
import { ILayerGroupConfig } from '../models/layer-group-config';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-layers',
  templateUrl: './layers.component.html',
  styleUrls: ['./layers.component.scss']
})
export class LayersComponent implements OnInit {

  layerGroups$: Observable<ILayerGroupConfig[]>;

  show = true;

  constructor(private mapService: MapService) { }

  ngOnInit() {

    this.layerGroups$ = this.mapService.mapConfig.pipe(
      map(mapConfig => mapConfig.mapInstance.layerGroups)
    );
  }

  onLayerVisiblityChanged(event: {layerId: number, visible: boolean}) {
    this.mapService.changeLayerVisibility(event.layerId, event.visible);
  }

  toggleShow() {
    this.show = !this.show;
  }

}
