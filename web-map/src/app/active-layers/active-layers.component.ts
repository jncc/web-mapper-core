import { Component, OnInit, ViewContainerRef, ViewChild, TemplateRef } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

import { Observable, Subscription, fromEvent } from 'rxjs';

import { MapService } from '../map.service';
import { ILayerConfig } from '../models/layer-config.model';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';

@Component({
  selector: 'app-active-layers',
  templateUrl: './active-layers.component.html',
  styleUrls: ['./active-layers.component.scss']
})
export class ActiveLayersComponent implements OnInit {

  show = true;

  visibleLayers$: Observable<ILayerConfig[]>;

  backdropSubscription: Subscription;
  @ViewChild('opacityOverlay') opacityOverlay: TemplateRef<any>;
  opacityOverlayRef: OverlayRef | null;

  @ViewChild('filterOverlay') filterOverlay: TemplateRef<any>;
  filterOverlayRef: OverlayRef | null;

  constructor(private mapService: MapService, public overlay: Overlay, public viewContainerRef: ViewContainerRef) {
    this.visibleLayers$ = this.mapService.visibleLayers;
  }

  ngOnInit() {
  }

  toggleShow() {
    this.show = !this.show;
  }

  drop(event: CdkDragDrop<string[]>) {
    this.mapService.reorderVisibleLayers(event.previousIndex, event.currentIndex);
  }

  openOpacity({ x, y }, activeLayer) {
    // console.log(x + ' ' + y + ' ' + activeLayer.layerName);
    this.closeOpacity();
    const positionStrategy = this.overlay.position()
      .flexibleConnectedTo({ x, y })
      .withPositions([
        {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
        }
      ]);

    this.opacityOverlayRef = this.overlay.create({
      hasBackdrop: true,
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.close()
    });


    this.opacityOverlayRef.attach(new TemplatePortal(this.opacityOverlay, this.viewContainerRef, {
      $implicit: activeLayer
    }));

    this.backdropSubscription = this.opacityOverlayRef.backdropClick().subscribe(() => this.closeOpacity());

  }

  closeOpacity() {
    if (this.opacityOverlayRef) {
      this.opacityOverlayRef.dispose();
      this.opacityOverlayRef = null;
    }
    if (this.backdropSubscription) {
      this.backdropSubscription.unsubscribe();
    }
  }

  onOpacityChanged(opacity: number, activeLayer) {
    this.mapService.changeLayerOpacity(activeLayer.layerId, opacity);
  }

  // Filter
  openFilter(activeLayer) {
    this.closeFilter();
    const positionStrategy = this.overlay.position()
      .global()
      .centerHorizontally()
      .centerVertically();

    this.filterOverlayRef = this.overlay.create({
      hasBackdrop: true,
      positionStrategy,
    });


    this.filterOverlayRef.attach(new TemplatePortal(this.filterOverlay, this.viewContainerRef, {
      $implicit: activeLayer
    }));

  }

  closeFilter() {
    if (this.filterOverlayRef) {
      this.filterOverlayRef.dispose();
      this.filterOverlayRef = null;
    }
  }

}
