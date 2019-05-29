import { Component, OnInit, ViewChild, TemplateRef, ViewContainerRef } from '@angular/core';
import { MapService } from '../map.service';
import { ILayerGroupConfig } from '../models/layer-group-config';

import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { OverlayRef, Overlay } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { IExternalWmsConfig } from '../models/external-wms-config.model';

@Component({
  selector: 'app-layers',
  templateUrl: './layers.component.html',
  styleUrls: ['./layers.component.scss']
})
export class LayersComponent implements OnInit {

  layerGroups$: Observable<ILayerGroupConfig[]>;
  externalWmsUrls: IExternalWmsConfig[];

  @ViewChild('externalLayersOverlay', { static: true }) externalLayersOverlay: TemplateRef<any>;
  externalLayersOverlayRef: OverlayRef | null;

  constructor(private mapService: MapService, public overlay: Overlay, public viewContainerRef: ViewContainerRef) { }

  ngOnInit() {
    this.layerGroups$ = this.mapService.mapConfig.pipe(
      tap(mapConfig => this.externalWmsUrls = mapConfig.mapInstance.externalWmsUrls),
      map(mapConfig => mapConfig.mapInstance.layerGroups)
    );
  }

  onLayerVisiblityChanged(event: {layerId: number, visible: boolean}) {
    this.mapService.changeLayerVisibility(event.layerId, event.visible);
  }

  onAddExternalLayers() {
    this.closeExternalLayers();
    const positionStrategy = this.overlay.position()
      .global()
      .centerHorizontally()
      .centerVertically();

      this.externalLayersOverlayRef = this.overlay.create({
        hasBackdrop: true,
        positionStrategy,
      });

      this.externalLayersOverlayRef.attach(new TemplatePortal(this.externalLayersOverlay, this.viewContainerRef, {
        $implicit: this.externalWmsUrls
      }));
  }

  closeExternalLayers() {
    if (this.externalLayersOverlayRef) {
      this.externalLayersOverlayRef.dispose();
      this.externalLayersOverlayRef = null;
    }
  }

}
