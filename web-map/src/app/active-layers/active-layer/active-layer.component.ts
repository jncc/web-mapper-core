import { Component, OnInit, Input } from '@angular/core';
import { ILayerConfig } from 'src/app/models/layer-config.model';
import { MapService } from 'src/app/map.service';

@Component({
  selector: 'app-active-layer',
  templateUrl: './active-layer.component.html',
  styleUrls: ['./active-layer.component.scss']
})
export class ActiveLayerComponent implements OnInit {
  @Input() layer: ILayerConfig;

  showFilter = false;
  filtered = false;

  constructor(private mapService: MapService) { }

  ngOnInit() {
  }

  onShowFilter() {
    this.showFilter = !this.showFilter;
  }

  onToggleFilter() {
    this.filtered = !this.filtered;
    alert('Filter status: ' + this.filtered);
  }

  onRemoveLayer() {
    this.mapService.changeLayerVisibility(this.layer.layerId, false);
  }

  onZoomToLayerExtent() {
    this.mapService.zoomToLayerExtent(this.layer.layerId);
  }

  onOpacityChanged(opacity: number) {
    this.mapService.changeLayerOpacity(this.layer.layerId, opacity);
  }

  onShowLegend() {
    this.mapService.showLegend(this.layer.layerId);
  }
}
