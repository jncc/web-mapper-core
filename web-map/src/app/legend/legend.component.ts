import { Component, OnInit, Input, ChangeDetectionStrategy, OnChanges, SimpleChanges } from '@angular/core';
import { MapService } from '../map.service';

@Component({
  selector: 'app-legend',
  templateUrl: './legend.component.html',
  styleUrls: ['./legend.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LegendComponent implements OnInit, OnChanges {

  @Input() legend: { name: string, legendUrl: string } = { name: '', legendUrl: ''};

  loading = true;

  constructor(private mapService: MapService) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
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

  onLoaded() {
    this.loading = false;
  }

}
