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

  zoomInToExtentActivated = false;
  zoomOutToExtentActivated = false;

  backdropSubscription: Subscription;
  @ViewChild('baseMapsOverlay') baseMapsOverlay: TemplateRef<any>;
  baseMapsOverlayRef: OverlayRef | null;

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
    this.zoomOutToExtentActivated = false;
    this.zoomInToExtentActivated = !this.zoomInToExtentActivated;
    this.sendControlStateToMapService();
  }

  onZoomOutToExtent() {
    this.zoomInToExtentActivated = false;
    this.zoomOutToExtentActivated = !this.zoomOutToExtentActivated;
    this.sendControlStateToMapService();
  }

  private sendControlStateToMapService() {
    this.mapService.dragZoomIn(this.zoomInToExtentActivated);
    this.mapService.dragZoomOut(this.zoomOutToExtentActivated);
  }

  onShowBaseMaps({x, y}) {
    this.closeBaseMaps();
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
    this.baseMapsOverlayRef = this.overlay.create({
      hasBackdrop: true,
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.close()
    });
    this.baseMapsOverlayRef.attach(new TemplatePortal(this.baseMapsOverlay, this.viewContainerRef));
    this.backdropSubscription = this.baseMapsOverlayRef.backdropClick().subscribe(() => this.closeBaseMaps());
  }

  closeBaseMaps() {
    if (this.baseMapsOverlayRef) {
      this.baseMapsOverlayRef.dispose();
      this.baseMapsOverlayRef = null;
    }
    if (this.backdropSubscription) {
      this.backdropSubscription.unsubscribe();
    }
  }

}
