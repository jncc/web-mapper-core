import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { ILayerConfig } from '../../models/layer-config.model';

@Component({
  selector: 'app-layer',
  templateUrl: './layer.component.html',
  styleUrls: ['./layer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayerComponent implements OnInit {

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
