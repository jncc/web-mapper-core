import { Component, OnInit } from '@angular/core';
import { IMapInstance } from '../models/map-instance.model';
import { IMapConfig } from '../models/map-config.model';
import { MapService } from '../map.service';

@Component({
  selector: 'app-map-instances',
  templateUrl: './map-instances.component.html',
  styleUrls: ['./map-instances.component.scss']
})
export class MapInstancesComponent implements OnInit {

  mapInstances: IMapInstance[];
  show = true;

  constructor(private mapService: MapService) { }

  ngOnInit() {
    this.mapService.mapConfig.subscribe((data: IMapConfig) => {
      this.mapInstances = data.mapInstances;
      console.log(this.mapInstances);
    }
    );
  }

  toggleShow() {
    this.show = !this.show;
  }

}
