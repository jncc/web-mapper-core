import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { IMapInstance } from '../models/map-instance.model';
import { MapService } from '../map.service';
import { IMapConfig } from '../models/map-config.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-map-info',
  templateUrl: './map-info.component.html',
  styleUrls: ['./map-info.component.scss']
})
export class MapInfoComponent implements OnInit, OnDestroy {
  @Output() closeMapInfo = new EventEmitter<void>();

  mapInstance: IMapInstance;
  mapInstanceSubscription: Subscription;

  constructor(private mapService: MapService) { }

  ngOnInit() {
    this.mapInstanceSubscription =
      this.mapService.mapConfig.subscribe((data: IMapConfig) => {
        this.mapInstance = data.mapInstance;
      });
  }

  onCloseMapInfo() {
    this.closeMapInfo.emit();
  }

  ngOnDestroy() {
    this.mapInstanceSubscription.unsubscribe();
  }

}
