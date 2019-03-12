import { Component, OnInit, ViewChild, TemplateRef, ViewContainerRef } from '@angular/core';
import { MapService } from '../map.service';
import { Subscription } from 'rxjs';
import { OverlayRef, Overlay } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';

@Component({
  selector: 'app-controls-toolbar',
  templateUrl: './controls-toolbar.component.html',
  styleUrls: ['./controls-toolbar.component.scss']
})
export class ControlsToolbarComponent implements OnInit {

  constructor(private mapService: MapService, public overlay: Overlay, public viewContainerRef: ViewContainerRef) { }

  backdropSubscription: Subscription;
  @ViewChild('baseLayersOverlay') baseLayersOverlay: TemplateRef<any>;
  baseLayersOverlayRef: OverlayRef | null;

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

  onShowBaseMaps({x, y}) {
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

}
