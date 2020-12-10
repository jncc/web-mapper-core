import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ILayerConfig } from 'src/app/models/layer-config.model';
import { MapService } from 'src/app/map.service';
import { ILookup } from 'src/app/models/lookup.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-active-layer',
  templateUrl: './active-layer.component.html',
  styleUrls: ['./active-layer.component.scss']
})
export class ActiveLayerComponent implements OnInit, OnDestroy {
  @Input() layer: ILayerConfig;
  // @Output() showOpacity: EventEmitter<{x: number, y: number}> = new EventEmitter();
  @Output() openFilter: EventEmitter<any> = new EventEmitter();

  filterActive = false;
  activeFiltersSubscription: Subscription;

  showOpacity = false;

  constructor(private mapService: MapService) { }

  ngOnInit() {
    this.activeFiltersSubscription = this.mapService.activeFilters.subscribe(activeFilters => {
      if (activeFilters.some(activeFilter => activeFilter.layerId === this.layer.layerId)) {
        this.filterActive = true;
      } else {
        this.filterActive = false;
      }
    });
  }

  onRemoveLayer() {
    this.mapService.changeLayerVisibility(this.layer.layerId, false);
  }

  onZoomToLayerExtent() {
    this.mapService.zoomToLayerExtent(this.layer.layerId);
  }

  onShowLegend() {
    this.mapService.showLegend(this.layer.layerId);
  }

  onShowOpacity(event: MouseEvent) {
    this.showOpacity = !this.showOpacity;
  }

  onOpacityChanged(opacity: number, activeLayer) {
    this.mapService.changeLayerOpacity(activeLayer.layerId, opacity);
  }

  onOpenFilter() {
    this.openFilter.emit();
  }

  onDownloadBbox(layer: ILayerConfig) {
    this.mapService.startDownloadByBox(layer.layerId);
  }

  ngOnDestroy() {
    this.activeFiltersSubscription.unsubscribe();
  }

}
