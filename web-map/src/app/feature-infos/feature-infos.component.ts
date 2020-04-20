import { Component, OnInit, OnDestroy } from '@angular/core';
import { MapService } from '../map.service';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-feature-infos',
  templateUrl: './feature-infos.component.html',
  styleUrls: ['./feature-infos.component.scss']
})
export class FeatureInfosComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();

  featureInfos$: Observable<any[]>;
  allowLayerHighlight: boolean;

  constructor(private mapService: MapService) { }

  ngOnInit() {
    this.featureInfos$ = this.mapService.featureInfos;

    this.subscription.add(
      this.mapService.mapConfig.subscribe(mapConfig => this.allowLayerHighlight = mapConfig.mapInstance.allowLayerHighlight)
    );

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  clearFeatureInfo() {
    this.mapService.clearFeatureInfo();
  }

}
