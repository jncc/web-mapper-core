import { Component, OnInit } from '@angular/core';
import { MapService } from '../map.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-feature-infos',
  templateUrl: './feature-infos.component.html',
  styleUrls: ['./feature-infos.component.scss']
})
export class FeatureInfosComponent implements OnInit {

  constructor(private mapService: MapService) { }

  featureInfos$: Observable<any[]>;

  ngOnInit() {
    this.featureInfos$ = this.mapService.featureInfos;
  }

  clearFeatureInfo() {
    this.mapService.clearFeatureInfo();
  }

}
