import { Component, OnInit } from '@angular/core';
import { MapService } from '../map.service';

@Component({
  selector: 'app-controls-toolbar',
  templateUrl: './controls-toolbar.component.html',
  styleUrls: ['./controls-toolbar.component.scss']
})
export class ControlsToolbarComponent implements OnInit {

  constructor(private mapService: MapService) { }

  zoomInToExtentActivated = false;
  zoomOutToExtentActivated = false;

  ngOnInit() {
  }

  onZoomIn() {
    this.mapService.zoomIn();
  }

  onZoomOut() {
    this.mapService.zoomOut();
  }

  onZoomToMapExtent() {
    this.mapService.zoomToMapExtent();
  }

  onZoomInToExtent() {
    this.zoomOutToExtentActivated = false;
    this.zoomInToExtentActivated = !this.zoomInToExtentActivated;
    this.sendControlStateToMapService();
  }

  onZoomOutToExtent() {
    this.zoomInToExtentActivated = false;
    this.zoomOutToExtentActivated = !this.zoomOutToExtentActivated;
    this.sendControlStateToMapService();
  }

  private sendControlStateToMapService() {
    this.mapService.dragZoomIn(this.zoomInToExtentActivated);
    this.mapService.dragZoomOut(this.zoomOutToExtentActivated);
  }

}
