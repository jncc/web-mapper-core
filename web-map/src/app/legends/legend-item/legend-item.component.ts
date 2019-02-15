import { Component, OnInit, Input } from '@angular/core';
import { ILayerConfig } from 'src/app/models/layer-config.model';
import { MapService } from 'src/app/map.service';

@Component({
  selector: 'app-legend-item',
  templateUrl: './legend-item.component.html',
  styleUrls: ['./legend-item.component.scss']
})
export class LegendItemComponent implements OnInit {
  @Input() legend: ILayerConfig;

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

  onRemoveLegend() {
    this.mapService.changeLayerVisibility(this.legend.layerId, false);
  }

  onZoomToLayerExtent() {
    this.mapService.zoomToLayerExtent(this.legend.layerId);
  }

  onOpacityChanged(opacity: number) {
    this.mapService.changeLayerOpacity(this.legend.layerId, opacity);
  }

}
