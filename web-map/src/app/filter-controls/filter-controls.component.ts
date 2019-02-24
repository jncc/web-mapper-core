import { Component, OnInit, Input, ViewChildren, QueryList } from '@angular/core';
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

}
