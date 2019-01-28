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
  }

  onChange(event) {
    this.visibilityChanged.emit(event.target.checked);
  }

}
