import { Component, OnInit, ViewContainerRef, ViewChild, TemplateRef } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

import { Observable, Subscription, fromEvent } from 'rxjs';

import { MapService } from '../map.service';
import { ILayerConfig } from '../models/layer-config.model';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { ILookup } from '../models/lookup.model';

@Component({
  selector: 'app-active-layers',
  templateUrl: './active-layers.component.html',
  styleUrls: ['./active-layers.component.scss']
})
export class ActiveLayersComponent implements OnInit {

  show = true;

  visibleLayers$: Observable<ILayerConfig[]>;

  subscription: Subscription;
  @ViewChild('opacityOverlay') opacityOverlay: TemplateRef<any>;
  overlayRef: OverlayRef | null;

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

  // opacity(activeLayer: any) {
  //   this.close();
  // }

  openOpacity({ x, y }, activeLayer) {
    // console.log(x + ' ' + y + ' ' + activeLayer.layerName);
    this.close();
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

    this.overlayRef = this.overlay.create({
      hasBackdrop: true,
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.close()
    });


    this.overlayRef.attach(new TemplatePortal(this.opacityOverlay, this.viewContainerRef, {
      $implicit: activeLayer
    }));

    this.subscription = this.overlayRef.backdropClick().subscribe(() => this.close());

  }

  close() {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onOpacityChanged(opacity: number, activeLayer) {
    this.mapService.changeLayerOpacity(activeLayer.layerId, opacity);
  }

}
