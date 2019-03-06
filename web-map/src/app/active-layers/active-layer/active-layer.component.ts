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
  @Output() showOpacity: EventEmitter<{x: number, y: number}> = new EventEmitter();
  @Output() openFilter: EventEmitter<any> = new EventEmitter();

  filterActive = false;
  activeFiltersSubscription: Subscription;

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

  onToggleFilter() {
    this.filterActive = !this.filterActive;
    alert('Filter status: ' + this.filterActive);
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

  ngOnDestroy() {
    this.activeFiltersSubscription.unsubscribe();
  }

}
