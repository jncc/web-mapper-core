import { Component, OnInit, Input } from '@angular/core';
import { ILayerConfig } from '../models/layer-config.model';
import { MapService } from '../map.service';
import { ILookup } from '../models/lookup.model';

@Component({
  selector: 'app-filter-controls',
  templateUrl: './filter-controls.component.html',
  styleUrls: ['./filter-controls.component.scss']
})
export class FilterControlsComponent implements OnInit {
  @Input() layer: ILayerConfig;

  filterLookup: { [lookupCategory: string]: ILookup[] } = {};

  constructor(private mapService: MapService) { }

  ngOnInit() {
    this.mapService.lookups.subscribe(data => this.filterLookup = data);
  }

}
