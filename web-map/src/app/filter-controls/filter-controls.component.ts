import { Component, OnInit, Input, ViewChildren, QueryList, Output, EventEmitter } from '@angular/core';
import { ILayerConfig } from '../models/layer-config.model';
import { MapService } from '../map.service';
import { ILookup } from '../models/lookup.model';
import { FilterControlComponent } from './filter-control/filter-control.component';
import { IActiveFilter } from '../models/active-filter.model';

@Component({
  selector: 'app-filter-controls',
  templateUrl: './filter-controls.component.html',
  styleUrls: ['./filter-controls.component.scss']
})
export class FilterControlsComponent implements OnInit {
  @Input() layer: ILayerConfig;
  @ViewChildren(FilterControlComponent) filterControls: QueryList<FilterControlComponent>;
  @Output() closeFilter = new EventEmitter<void>();

  filterLookup: { [lookupCategory: string]: ILookup[] } = {};
  activeFilters: IActiveFilter[];

  constructor(private mapService: MapService) { }

  ngOnInit() {
    this.mapService.lookups.subscribe(data => this.filterLookup = data);
    this.mapService.activeFilters.subscribe(data => {
      this.activeFilters = data.filter(f => f.layerId === this.layer.layerId);
    });
  }

  onFilterApplied() {
    const activeFilters: IActiveFilter[] = [];
    this.filterControls.forEach(control => {
        activeFilters.push({
          layerId: this.layer.layerId,
          filterId: control.filterConfig.filterId,
          filterLookupIds: control.filterLookupIds,
          filterText: control.filterText
        });
    });
    this.mapService.createLayerFilter(this.layer.layerId, activeFilters);
    this.closeFilter.emit();
  }

  onFilterCleared() {
    this.mapService.clearFilterLayer(this.layer);
  }

  onCloseFilter() {
    this.closeFilter.emit();
  }

  // TODO: check filter validity
  private isValidFilter(): boolean {
    if (this.layer.filters.every(filter => filter.isComplex)) {
      return true;
    }
    if (this.layer.filters.every(filter => !filter.isComplex)) {
      return true;
    }
    return false;
  }

  private isComplexFilter(): boolean {
    return this.layer.filters.every(filter => filter.isComplex);
  }

}
