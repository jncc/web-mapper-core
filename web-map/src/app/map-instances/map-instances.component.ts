import { Component, OnInit } from '@angular/core';
import { IMapInstance } from '../models/map-instance.model';
import { MapConfigService } from '../map-config.service';
import { IMapConfig } from '../models/map-config.model';

@Component({
  selector: 'app-map-instances',
  templateUrl: './map-instances.component.html',
  styleUrls: ['./map-instances.component.scss']
})
export class MapInstancesComponent implements OnInit {

  mapInstances: IMapInstance[];
  show = true;

  constructor(private mapConfigService: MapConfigService) { }

  ngOnInit() {
   this.mapConfigService.config.subscribe((data: IMapConfig) => this.mapInstances = data.mapInstances);
  }

  toggleShow() {
    this.show = !this.show;
  }

}
