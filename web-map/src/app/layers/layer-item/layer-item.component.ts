import { Component, OnInit, Input } from '@angular/core';
import { ILayerConfig } from 'src/app/models/layer-config.model';

@Component({
  selector: 'app-layer-item',
  templateUrl: './layer-item.component.html',
  styleUrls: ['./layer-item.component.scss']
})
export class LayerItemComponent implements OnInit {

  @Input() layer: ILayerConfig;

  constructor() { }

  ngOnInit() {
  }

  onChange(event) {
    console.log(event);
  }

}
