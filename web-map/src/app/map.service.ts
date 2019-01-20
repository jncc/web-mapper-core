import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  map: any;

  constructor() { }

  mapReady(map: any) {
    this.map = map;
  }

  zoomIn() {
    this.map.getView().setZoom(this.map.getView().getZoom() + 1);
  }

  zoomout() {
    this.map.getView().setZoom(this.map.getView().getZoom() - 1);
  }
}
