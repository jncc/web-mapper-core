import { ComponentRef, Directive, ElementRef, HostListener, Input, OnInit, Host } from '@angular/core';
import { Overlay, OverlayPositionBuilder, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';

import { TooltipComponent } from './tooltip.component';
import { ClassGetter } from '@angular/compiler/src/output/output_ast';

// https://blog.angularindepth.com/building-tooltips-for-angular-3cdaac16d138

// tslint:disable-next-line:directive-selector
@Directive({ selector: '[tooltip]' })
export class TooltipDirective implements OnInit {

  @Input('tooltip') text = '';
  @Input() hideDelay = 1500;
  private overlayRef: OverlayRef;
  showDelay = 500;

  /** The timeout ID of any current timer set to show the tooltip */
  private showTimeoutId: number | null;

  constructor(private overlay: Overlay,
    private overlayPositionBuilder: OverlayPositionBuilder,
    private elementRef: ElementRef) {
  }

  ngOnInit(): void {
    const positionStrategy = this.overlayPositionBuilder
      .flexibleConnectedTo(this.elementRef)
      .withPositions([{
        originX: 'center',
        originY: 'top',
        overlayX: 'center',
        overlayY: 'bottom',
        offsetY: -4,
      }]);

    this.overlayRef = this.overlay.create({ positionStrategy });
  }

  @HostListener('mouseenter')
  show() {
    this.showTimeoutId = window.setTimeout(() => {
      const tooltipRef: ComponentRef<TooltipComponent> = this.overlayRef.attach(new ComponentPortal(TooltipComponent));
      tooltipRef.instance.text = this.text;
      this.showTimeoutId = null;
      window.setTimeout(() => {
        this.hide();
      }, this.hideDelay);
    }, this.showDelay);
  }

  @HostListener('mouseout')
  @HostListener('mousedown')
  hide() {
    if (this.showTimeoutId) {
      clearTimeout(this.showTimeoutId);
      this.showTimeoutId = null;
    }
    this.overlayRef.detach();
  }
}
