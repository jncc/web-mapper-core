import { Component, OnInit, Input, ViewChildren, QueryList, Output, EventEmitter } from '@angular/core';
import { ILayerConfig } from '../models/layer-config.model';
import { MapService } from '../map.service';
import { ILookup } from '../models/lookup.model';
import { FilterControlComponent } from './filter-control/filter-control.component';
import { CloseScrollStrategy } from '@angular/cdk/overlay';


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
    this.filterControls.forEach(control => {
      if (control.filterCodes.length > 0) {
        filter[control.filterAttribute] = control.filterCodes;
      }
    });
    this.mapService.filterLayer(this.layer.layerId, filter);
  }

  onFilterCleared() {
    this.mapService.clearFilterLayer(this.layer.layerId);
  }

  onCloseFilter() {
    this.closeFilter.emit();
  }

/*
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
