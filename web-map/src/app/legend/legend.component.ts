import { Component, OnInit, Input, ChangeDetectionStrategy, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { MapService } from '../map.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-legend',
  templateUrl: './legend.component.html',
  styleUrls: ['./legend.component.scss']
})
export class LegendComponent implements OnInit, OnDestroy {

  loading = true;
  show = false;
  legend: { name: string, legendUrl: string };
  showLegendSubscription: Subscription;

  constructor(private mapService: MapService) { }

  ngOnInit() {
    this.showLegendSubscription = this.mapService.showLegendSubject.subscribe(legend => {
      this.showLegend(legend);
    });
  }

  private testngOnChanges(changes: SimpleChanges) {
    console.log(changes.legend);
    if (changes.legend.previousValue) {
      if (changes.legend.previousValue.legendUrl !== changes.legend.currentValue.legendUrl) {
        this.loading = true;
      }
    }
  }
  onHideLegend() {
    this.mapService.hideLegend();
  }

  showLegend(legend: { name: string, legendUrl: string }) {
    if (legend) {
      this.show = true;
      // if browser caches image then img load event isn't raised so test for this
      // so spinner displays appropriately
      // TODO: test this will always work
      if (this.legend) {
        if (this.legend.legendUrl !== legend.legendUrl) {
          this.loading = true;
        }
      }
      this.legend = legend;
    } else {
      this.show = false;
      this.legend = null;
    }
    console.log(this.legend);
  }

  onLegendImageLoaded() {
    this.loading = false;
  }

  ngOnDestroy() {
    if (this.showLegendSubscription) {
      this.showLegendSubscription.unsubscribe();
    }
  }

}
