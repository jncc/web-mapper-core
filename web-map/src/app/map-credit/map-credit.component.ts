import { Component, OnInit, OnDestroy } from '@angular/core';
import { IMapInstance } from '../models/map-instance.model';
import { Subscription } from 'rxjs';
import { IMapConfig } from '../models/map-config.model';
import { MapService } from '../map.service';

@Component({
  selector: 'app-map-credit',
  templateUrl: './map-credit.component.html',
  styleUrls: ['./map-credit.component.scss']
})
export class MapCreditComponent implements OnInit, OnDestroy {

  mapInstance: IMapInstance;
  mapInstanceSubscription: Subscription;

  constructor(private mapService: MapService) { }

  ngOnInit() {
    this.mapInstanceSubscription =
      this.mapService.mapConfig.subscribe((data: IMapConfig) => {
        this.mapInstance = data.mapInstance;
      });
  }

  ngOnDestroy() {
    this.mapInstanceSubscription.unsubscribe();
  }
}
