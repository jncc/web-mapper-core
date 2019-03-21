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
    // if (this.isComplexFilter()) {
    //   this.applySqlViewFilter();
    // } else {
    //   this.applyCqlFilter();
    // }

    const newActiveFilters: IActiveFilter[] = [];
    this.filterControls.forEach(control => {
        newActiveFilters.push({
          layerId: this.layer.layerId,
          filterId: control.filterConfig.filterId,
          filterCodes: control.filterCodes,
          filterText: control.filterText
        });
    });
    this.mapService.createLayerFilter(newActiveFilters);
  }

  onFilterCleared() {
    let paramName = '';
    if (this.isComplexFilter()) {
      paramName = 'viewParams';
    } else {
      paramName = 'CQL_FILTER';
    }
    this.mapService.clearFilterLayer(this.layer.layerId, paramName);
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

  // In Geoserver SQL Views, semicolons or commas must be escaped with a backslash (e.g. \, and \;)
  private escapeSpecialCharacters(value: string): string {
    return value.replace(/,/g, '\\,').replace(/;/g, '\\;');
  }

  private applyCqlFilter() {
    const paramName = 'CQL_FILTER';
    let filterString = '';
    const newActiveFilters: IActiveFilter[] = [];
    this.filterControls.forEach(control => {
      if (control.filterConfig.type === 'lookup' && control.filterCodes.length > 0) {
        if (filterString.length > 0) {
          // there is already at least one filter in the string so use AND
          filterString += ' AND ';
        }
        filterString += control.filterConfig.attribute + ' IN (' + control.filterCodes.map(code => `'${code}'`).join() + ')';
        newActiveFilters.push({
          layerId: this.layer.layerId,
          filterId: control.filterConfig.filterId,
          filterCodes: control.filterCodes,
          filterText: control.filterText
        });
      }
    });
    this.mapService.filterLayer(this.layer.layerId, paramName, filterString, newActiveFilters);
  }

  private applySqlViewFilter() {
    const paramName = 'viewParams';
    let filterString = '';
    const newActiveFilters: IActiveFilter[] = [];
    this.filterControls.forEach(control => {
      if (control.filterConfig.type === 'lookup' && control.filterCodes.length > 0) {
        // filterString += control.filterAttribute + ':' + control.filterCodes.map(code => `'${
        //   code.replace(/,/g, '\\,').replace(/:/g, '\\,')}'`).join('\\,') + ';';
        filterString += control.filterConfig.attribute + ':';
        control.filterCodes.forEach((filterCode, index) => {
          const code = '\'' + this.escapeSpecialCharacters(filterCode) + '\'';
          filterString += code;
          if (index < control.filterCodes.length - 1) {
            filterString += '\\,';
          }
        });
        filterString += ';';

        newActiveFilters.push({
          layerId: this.layer.layerId,
          filterId: control.filterConfig.filterId,
          filterCodes: control.filterCodes,
          filterText: control.filterText
        });
      }
      if (control.filterConfig.type === 'text' && control.filterText.length > 0) {
        filterString += control.filterConfig.attribute + ':';
        filterString += this.escapeSpecialCharacters(control.filterText);
        filterString += ';';

        newActiveFilters.push({
          layerId: this.layer.layerId,
          filterId: control.filterConfig.filterId,
          filterCodes: control.filterCodes,
          filterText: control.filterText
        });
      }
    });
    this.mapService.filterLayer(this.layer.layerId, paramName, filterString, newActiveFilters);
  }
}
