import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ILayerConfig } from 'src/app/models/layer-config.model';
import { MapService } from 'src/app/map.service';
import { ILookup } from 'src/app/models/lookup.model';

@Component({
  selector: 'app-active-layer',
  templateUrl: './active-layer.component.html',
  styleUrls: ['./active-layer.component.scss']
})
export class ActiveLayerComponent implements OnInit {
  @Input() layer: ILayerConfig;
  @Output() showOpacity: EventEmitter<{x: number, y: number}> = new EventEmitter();
  @Output() openFilter: EventEmitter<any> = new EventEmitter();

  showFilter = false;
  filtered = false;

  filterLookup: { [lookupCategory: string]: ILookup[] } = {};

  constructor(private mapService: MapService) { }

  ngOnInit() {
    this.mapService.lookups.subscribe(data => this.filterLookup = data);
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

  onShowOpacity(event: MouseEvent) {
    this.showOpacity.emit({x: event.x, y: event.y});
  }

  onOpenFilter() {
    this.openFilter.emit();
  }

}
