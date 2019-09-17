import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ILayerConfig } from '../../models/layer-config.model';

@Component({
  selector: 'app-layer',
  templateUrl: './layer.component.html',
  styleUrls: ['./layer.component.scss']
})
export class LayerComponent implements OnInit {

  @Input() layer: ILayerConfig;
  @Output() visibilityChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  onToggleVisibility() {
    this.visibilityChanged.emit(!this.layer.visible);
  }
}
