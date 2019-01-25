import { Component, OnInit } from '@angular/core';
import { MapService } from '../map.service';

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
      if (data.mapInstances) {
        this.layers = data.mapInstances[0].layers;
      }
    });
  }

  toggleShow() {
    this.show = !this.show;
  }

}
