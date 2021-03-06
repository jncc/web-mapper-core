import { Component, OnInit, ViewChild, TemplateRef, ViewContainerRef, Output, EventEmitter } from '@angular/core';
import { MapService } from '../map.service';
import { Subscription } from 'rxjs';
import { OverlayRef, Overlay } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { MeasureService } from '../measure.service';

@Component({
  selector: 'app-controls-toolbar',
  templateUrl: './controls-toolbar.component.html',
  styleUrls: ['./controls-toolbar.component.scss']
})
export class ControlsToolbarComponent implements OnInit {

  @Output() showGotoXY = new EventEmitter<void>();

  backdropSubscription: Subscription;
  @ViewChild('baseLayersOverlay', { static: true }) baseLayersOverlay: TemplateRef<any>;
  baseLayersOverlayRef: OverlayRef | null;

  @ViewChild('measureOverlay', { static: true }) measureOverlay: TemplateRef<any>;
  measureOverlayRef: OverlayRef | null;

  @ViewChild('mapInfoOverlay', { static: true }) mapInfoOverlay: TemplateRef<any>;
  mapInfoOverlayRef: OverlayRef | null;

  @ViewChild('permalinkOverlay', { static: true }) permalinkOverlay: TemplateRef<any>;
  permalinkOverlayRef: OverlayRef | null;

  constructor(
    private mapService: MapService,
    public overlay: Overlay,
    public viewContainerRef: ViewContainerRef
  ) { }

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

  onShowBaseLayers({ x, y }) {
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

  onShowMeasure() {
    this.closeMeasure();
    const positionStrategy = this.overlay.position()
      .global()
      .right('1rem')
      .top('13rem');

    this.measureOverlayRef = this.overlay.create({
      hasBackdrop: false,
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.close()
    });
    this.measureOverlayRef.attach(new TemplatePortal(this.measureOverlay, this.viewContainerRef));
  }

  closeMeasure() {
    if (this.measureOverlayRef) {
      this.measureOverlayRef.dispose();
      this.measureOverlayRef = null;
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
      panelClass: 'map-info-overlay',
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

  onShowPermalink() {
    const permalink = this.mapService.createPermalink();

    this.closePermalink();
    const positionStrategy = this.overlay.position()
      .global()
      .centerHorizontally()
      .centerVertically();

    this.permalinkOverlayRef = this.overlay.create({
      hasBackdrop: true,
      positionStrategy,
    });

    this.permalinkOverlayRef.attach(new TemplatePortal(this.permalinkOverlay, this.viewContainerRef, {
      $implicit: permalink
    }));

    this.backdropSubscription = this.permalinkOverlayRef.backdropClick().subscribe(() => this.closePermalink());
  }

  closePermalink() {
    if (this.permalinkOverlayRef) {
      this.permalinkOverlayRef.dispose();
      this.permalinkOverlayRef = null;
    }
    if (this.backdropSubscription) {
      this.backdropSubscription.unsubscribe();
    }
  }

  onShowGotoXY() {
    this.showGotoXY.emit();
  }

}
