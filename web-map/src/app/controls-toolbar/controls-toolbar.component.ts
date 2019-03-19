import { Component, OnInit, ViewChild, TemplateRef, ViewContainerRef } from '@angular/core';
import { MapService } from '../map.service';
import { Subscription } from 'rxjs';
import { OverlayRef, Overlay } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { IMapConfig } from '../models/map-config.model';
import { IMapInstance } from '../models/map-instance.model';

@Component({
  selector: 'app-controls-toolbar',
  templateUrl: './controls-toolbar.component.html',
  styleUrls: ['./controls-toolbar.component.scss']
})
export class ControlsToolbarComponent implements OnInit {

  backdropSubscription: Subscription;
  @ViewChild('baseLayersOverlay') baseLayersOverlay: TemplateRef<any>;
  baseLayersOverlayRef: OverlayRef | null;

  @ViewChild('mapInfoOverlay') mapInfoOverlay: TemplateRef<any>;
  mapInfoOverlayRef: OverlayRef | null;

  constructor(private mapService: MapService, public overlay: Overlay, public viewContainerRef: ViewContainerRef) { }

  ngOnInit() {
  }

  onZoomIn() {
    this.mapService.zoomIn();
  }

  onZoomOut() {
    this.mapService.zoomOut();
  }

  onZoomToMapExtent() {
    this.mapService.zoomToMapExtent();
  }

  onZoomInToExtent() {
    this.mapService.dragZoomIn();
  }

  onZoomOutToExtent() {
    this.mapService.dragZoomOut();
  }

  onCreatePermalink() {
    this.mapService.createPermalink();
  }

  onShowBaseLayers({x, y}) {
    this.closeBaseLayers();
    const positionStrategy = this.overlay.position()
    .flexibleConnectedTo({ x, y })
    .withPositions([
      {
        originX: 'end',
        originY: 'bottom',
        overlayX: 'end',
        overlayY: 'bottom',
      }
    ]);
    this.baseLayersOverlayRef = this.overlay.create({
      hasBackdrop: true,
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.close()
    });
    this.baseLayersOverlayRef.attach(new TemplatePortal(this.baseLayersOverlay, this.viewContainerRef));
    this.backdropSubscription = this.baseLayersOverlayRef.backdropClick().subscribe(() => this.closeBaseLayers());
  }

  closeBaseLayers() {
    if (this.baseLayersOverlayRef) {
      this.baseLayersOverlayRef.dispose();
      this.baseLayersOverlayRef = null;
    }
    if (this.backdropSubscription) {
      this.backdropSubscription.unsubscribe();
    }
  }

  onShowMapInfo() {
    this.closeMapInfo();
    const positionStrategy = this.overlay.position()
      .global()
      .centerHorizontally()
      .centerVertically();

    this.mapInfoOverlayRef = this.overlay.create({
      hasBackdrop: true,
      positionStrategy,
    });


    this.mapInfoOverlayRef.attach(new TemplatePortal(this.mapInfoOverlay, this.viewContainerRef));
    this.backdropSubscription = this.mapInfoOverlayRef.backdropClick().subscribe(() => this.closeMapInfo());
  }

  closeMapInfo() {
    if (this.mapInfoOverlayRef) {
      this.mapInfoOverlayRef.dispose();
      this.mapInfoOverlayRef = null;
    }
    if (this.backdropSubscription) {
      this.backdropSubscription.unsubscribe();
    }
  }

}
