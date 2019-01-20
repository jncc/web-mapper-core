import { Component, OnInit } from '@angular/core';
import { MapService } from '../map.service';

@Component({
  selector: 'app-controls-toolbar',
  templateUrl: './controls-toolbar.component.html',
  styleUrls: ['./controls-toolbar.component.css']
})
export class ControlsToolbarComponent implements OnInit {

  constructor(private mapService: MapService) { }

  ngOnInit() {
  }

  zoomIn() {
    this.mapService.zoomIn();
  }

  zoomOut() {
    this.mapService.zoomout();
  }

}
