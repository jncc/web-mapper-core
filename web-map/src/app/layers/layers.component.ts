import { Component, OnInit, ViewChild, TemplateRef, ViewContainerRef } from '@angular/core';
import { MapService } from '../map.service';
import { ILayerGroupConfig } from '../models/layer-group-config';

import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { OverlayRef, Overlay } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';

@Component({
  selector: 'app-layers',
  templateUrl: './layers.component.html',
  styleUrls: ['./layers.component.scss']
})
export class LayersComponent implements OnInit {

  layerGroups$: Observable<ILayerGroupConfig[]>;

  // show = true;

  backdropSubscription: Subscription;
  @ViewChild('externalLayersOverlay') externalLayersOverlay: TemplateRef<any>;
  externalLayersOverlayRef: OverlayRef | null;

  constructor(private mapService: MapService, public overlay: Overlay, public viewContainerRef: ViewContainerRef) { }

  ngOnInit() {
    this.layerGroups$ = this.mapService.mapConfig.pipe(
      map(mapConfig => mapConfig.mapInstance.layerGroups)
    );
  }

  onLayerVisiblityChanged(event: {layerId: number, visible: boolean}) {
    this.mapService.changeLayerVisibility(event.layerId, event.visible);
  }

  // toggleShow() {
  //   this.show = !this.show;
  // }

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

      this.externalLayersOverlayRef.attach(new TemplatePortal(this.externalLayersOverlay, this.viewContainerRef));

      this.backdropSubscription = this.externalLayersOverlayRef.backdropClick().subscribe(() => this.closeExternalLayers());
  }

  private closeExternalLayers() {
    if (this.externalLayersOverlayRef) {
      this.externalLayersOverlayRef.dispose();
      this.externalLayersOverlayRef = null;
    }
    if (this.backdropSubscription) {
      this.backdropSubscription.unsubscribe();
    }
  }

}
