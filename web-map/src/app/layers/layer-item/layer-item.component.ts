import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ILayerConfig } from '../../models/layer-config.model';

@Component({
  selector: 'app-layer-item',
  templateUrl: './layer-item.component.html',
  styleUrls: ['./layer-item.component.scss']
})
export class LayerItemComponent implements OnInit {

  @Input() layer: ILayerConfig;
  @Output() visibilityChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
    // console.log(this.layer);
  }

  onChange(event) {
    const visible = event.target.checked;
    this.visibilityChanged.emit(visible);
  }

}
