import { Component, OnInit, Input, ViewChildren, QueryList, Output, EventEmitter } from '@angular/core';
import { ILayerConfig } from '../models/layer-config.model';
import { MapService } from '../map.service';
import { ILookup } from '../models/lookup.model';
import { FilterControlComponent } from './filter-control/filter-control.component';


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

  constructor(private mapService: MapService) { }

  ngOnInit() {
    this.mapService.lookups.subscribe(data => this.filterLookup = data);
  }

  onFilterApplied() {
    const filter = {};
    let paramName = '';
    let filterString = '';
    this.filterControls.forEach(control => {
      if (control.filterCodes.length > 0) {
        filter[control.filterAttribute] = control.filterCodes;
      }
    });

    if (this.isComplexFilter()) {
      paramName = 'viewParams';
      filterString = this.createSqlViewFilterString();
    } else {
      paramName = 'CQL_FILTER';
      filterString = this.createCqlFilterString();
    }
    this.mapService.filterLayer(this.layer.layerId, paramName, filterString);
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

  private isComplexFilter(): boolean {
    return this.layer.filters.every(filter => filter.isComplex);
  }

  // In Geoserver SQL Views, semicolons or commas must be escaped with a backslash (e.g. \, and \;)
  private escapeSpecialCharacters(value: string): string {
    return value.replace(/,/g, '\\,').replace(/;/g, '\\;');
  }

  private createCqlFilterString(): string {
    let filterString = '';
    this.filterControls.forEach(control => {
      if (control.filterType === 'lookup' && control.filterCodes.length > 0) {
        if (filterString.length > 0) {
          // there is already at least one filter in the string so use AND
          filterString += ' AND ';
        }
        filterString += control.filterAttribute + ' IN (' + control.filterCodes.map(code => `'${code}'`).join() + ')';
      }
    });
    return filterString;
  }

  private createSqlViewFilterString(): string {
    let filterString = '';
    this.filterControls.forEach(control => {
      if (control.filterType === 'lookup' && control.filterCodes.length > 0) {
        // filterString += control.filterAttribute + ':' + control.filterCodes.map(code => `'${
        //   code.replace(/,/g, '\\,').replace(/:/g, '\\,')}'`).join('\\,') + ';';
        filterString += control.filterAttribute + ':';
        control.filterCodes.forEach((filterCode, index) => {
          const code = '\'' + this.escapeSpecialCharacters(filterCode) + '\'';
          filterString += code;
          if (index < control.filterCodes.length - 1) {
            filterString += '\\,';
          }
        });
        filterString += ';';
      }
      if (control.filterType === 'text' && control.filterText.length > 0) {
        filterString += control.filterAttribute + ':';
        filterString += this.escapeSpecialCharacters(control.filterText);
        filterString += ';';
      }
    });
    return filterString;
  }

/*

  // FROM map service

  // TODO: this doesn't work if you supply the same attribute twice
  // the filterAttributes will get overwritten
  filterLayer(layerId: number, filter: any) {
    const layerConfig = this.getLayerConfig(layerId);
    const source = layerConfig.layer.getSource();
    const params = layerConfig.layer.getSource().getParams();
    const filterAttributes = Object.keys(filter);
    let cqlFilter = '';
    filterAttributes.forEach(attribute => {
      if (cqlFilter.length > 0) {
        // there is already at least one filter so use AND
        cqlFilter += ' AND ';
      }
      cqlFilter += cqlFilter + attribute + ' IN (' + filter[attribute].map(code => `'${code}'`).join() + ')';
    });
    params['CQL_FILTER'] = cqlFilter;
    console.log(cqlFilter);
    source.updateParams(params);
  }

  clearFilterLayer(layerId) {
    const layerConfig = this.getLayerConfig(layerId);
    const source = layerConfig.layer.getSource();
    const params = layerConfig.layer.getSource().getParams();
    delete params['CQL_FILTER'];
    source.updateParams(params);
  }

 */

}
