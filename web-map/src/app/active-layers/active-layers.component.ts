import { Component, OnInit } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

import { Observable } from 'rxjs';

import { MapService } from '../map.service';
import { ILayerConfig } from '../models/layer-config.model';

@Component({
  selector: 'app-active-layers',
  templateUrl: './active-layers.component.html',
  styleUrls: ['./active-layers.component.scss']
})
export class ActiveLayersComponent implements OnInit {

  show = true;

  visibleLayers$: Observable<ILayerConfig[]>;

  constructor(private mapService: MapService) {
    this.visibleLayers$ = this.mapService.visibleLayers;
  }

  ngOnInit() {
  }

  toggleShow() {
    this.show = !this.show;
  }

  drop(event: CdkDragDrop<string[]>) {
    this.mapService.reorderVisibleLayers(event.previousIndex, event.currentIndex);
  }

}
