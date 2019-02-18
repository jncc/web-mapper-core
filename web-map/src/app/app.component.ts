import { Component, OnDestroy } from '@angular/core';
import { AppConfigService } from './app-config.service';
import { XmlConverter } from './xmlconverter';
import { MapService } from './map.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {

  show = false;
  legend: { name: string, legendUrl: string };

  constructor(private mapService: MapService) {
    const converter = new XmlConverter();
    converter.convert();

    this.showLegendSubscription = this.mapService.showLegendSubject.subscribe(legend => {
      this.showLegend(legend);
    });
  }

  showLegend(legend: { name: string, legendUrl: string }) {
    if (legend) {
      this.show = true;
      this.legend = legend;
    } else {
      this.show = false;
      this.legend = null;
    }
  }

  ngOnDestroy() {
    if (this.showLegendSubscription) {
      this.showLegendSubscription.unsubscribe();
    }
  }
}
